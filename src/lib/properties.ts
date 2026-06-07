import { getStore, recordAudit } from "./store";
import { applyListingQuery } from "./filters";
import {
  formatHadap,
  formatMeter,
  formatRupiah,
} from "./format";
import { SIAP_LABEL, STATUS_LABEL, TIPE_LABEL } from "./constants";
import type {
  AuditChange,
  ListingQuery,
  ListingResult,
  Property,
  PropertyInput,
  Role,
} from "./types";

// =========================================================================
// Server-side property data access (Node runtime).
// All listing mutations funnel through here so the audit log stays complete.
// =========================================================================

export function listProperties(query: ListingQuery): ListingResult {
  return applyListingQuery(getStore().properties, query);
}

export function getPropertyById(id: string): Property | null {
  const p = getStore().properties.find((x) => x.id === id);
  if (!p || p.deleted_at) return null;
  return p;
}

export function getFeaturedProperties(limit = 6): Property[] {
  return getStore()
    .properties.filter((p) => !p.deleted_at && p.status === "in_stock")
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, limit);
}

export function countActiveProperties(): number {
  return getStore().properties.filter((p) => !p.deleted_at).length;
}

/** Other live listings in the same kawasan/tipe — for the public detail page. */
export function getRelatedProperties(property: Property, limit = 3): Property[] {
  return getStore()
    .properties.filter(
      (p) =>
        !p.deleted_at &&
        p.id !== property.id &&
        (p.tipe === property.tipe ||
          p.kawasan.some((k) => property.kawasan.includes(k)))
    )
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, limit);
}

function nextId(): string {
  const store = getStore();
  let max = 0;
  for (const p of store.properties) {
    const n = Number(p.id.replace(/\D/g, ""));
    if (n > max) max = n;
  }
  return `PRP-${String(max + 1).padStart(4, "0")}`;
}

interface Actor {
  name: string;
  role: Role;
}

export function createProperty(input: PropertyInput, actor: Actor): Property {
  const store = getStore();
  const now = new Date().toISOString();
  const property: Property = {
    ...input,
    id: nextId(),
    created_at: now,
    updated_at: now,
    created_by: actor.name,
    deleted_at: null,
  };
  store.properties.unshift(property);

  recordAudit({
    actor: actor.name,
    actorRole: actor.role,
    action: "create_property",
    target: property.nama_property,
    summary: `Menambahkan properti "${property.nama_property}" (${property.id}).`,
  });

  return property;
}

const FIELD_LABEL: Record<string, string> = {
  nama_property: "Nama",
  group: "Group",
  lebar: "Lebar",
  panjang: "Panjang",
  hadap: "Hadap",
  tipe: "Tipe",
  tingkat: "Tingkat",
  price: "Harga",
  carport: "Carport",
  status: "Status",
  siap: "Siap",
  maps_link: "Maps Link",
  kawasan: "Kawasan",
  unit: "Unit",
  imageUrl: "Gambar",
};

function displayValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  switch (field) {
    case "price":
      return formatRupiah(value as number);
    case "lebar":
    case "panjang":
    case "tingkat":
      return formatMeter(value as number);
    case "hadap":
      return formatHadap(value as string[]);
    case "kawasan":
      return (value as string[]).join(", ");
    case "tipe":
      return TIPE_LABEL[value as keyof typeof TIPE_LABEL] ?? String(value);
    case "status":
      return STATUS_LABEL[value as keyof typeof STATUS_LABEL] ?? String(value);
    case "siap":
      return SIAP_LABEL[value as keyof typeof SIAP_LABEL] ?? String(value);
    case "carport":
      return value ? "Ya" : "Tidak";
    default:
      return String(value);
  }
}

function diffProperty(prev: Property, input: PropertyInput): AuditChange[] {
  const changes: AuditChange[] = [];
  const keys: (keyof PropertyInput)[] = [
    "nama_property",
    "group",
    "lebar",
    "panjang",
    "hadap",
    "tipe",
    "tingkat",
    "price",
    "carport",
    "status",
    "siap",
    "maps_link",
    "kawasan",
    "unit",
    "imageUrl",
  ];
  for (const key of keys) {
    const before = JSON.stringify(prev[key] ?? null);
    const after = JSON.stringify(input[key] ?? null);
    if (before !== after) {
      changes.push({
        field: FIELD_LABEL[key] ?? key,
        from: displayValue(key, prev[key]),
        to: displayValue(key, input[key]),
      });
    }
  }
  return changes;
}

export function updateProperty(
  id: string,
  input: PropertyInput,
  actor: Actor
): Property | null {
  const store = getStore();
  const idx = store.properties.findIndex((p) => p.id === id && !p.deleted_at);
  if (idx === -1) return null;

  const prev = store.properties[idx];
  const changes = diffProperty(prev, input);
  const updated: Property = {
    ...prev,
    ...input,
    updated_at: new Date().toISOString(),
  };
  store.properties[idx] = updated;

  recordAudit({
    actor: actor.name,
    actorRole: actor.role,
    action: "update_property",
    target: updated.nama_property,
    summary:
      changes.length > 0
        ? `Memperbarui ${changes.length} field pada "${updated.nama_property}".`
        : `Menyimpan "${updated.nama_property}" tanpa perubahan.`,
    changes,
  });

  return updated;
}

export function softDeleteProperty(id: string, actor: Actor): boolean {
  const store = getStore();
  const property = store.properties.find((p) => p.id === id && !p.deleted_at);
  if (!property) return false;
  property.deleted_at = new Date().toISOString();

  recordAudit({
    actor: actor.name,
    actorRole: actor.role,
    action: "delete_property",
    target: property.nama_property,
    summary: `Menghapus properti "${property.nama_property}" (${property.id}).`,
  });

  return true;
}
