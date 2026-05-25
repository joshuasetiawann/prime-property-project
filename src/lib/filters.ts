import type {
  ListingQuery,
  ListingResult,
  Property,
} from "./types";

// =========================================================================
// Listing filter · sort · paginate (shared by API and demo fallback).
// =========================================================================

function matches(p: Property, q: ListingQuery): boolean {
  if (p.deleted_at) return false;

  if (q.search.trim()) {
    const needle = q.search.trim().toLowerCase();
    const haystack = [
      p.nama_property,
      p.group ?? "",
      ...p.kawasan,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  if (q.kawasan.length && !q.kawasan.some((k) => p.kawasan.includes(k)))
    return false;

  if (q.hadap.length && !q.hadap.some((h) => p.hadap.includes(h))) return false;

  if (q.siap.length && !q.siap.includes(p.siap)) return false;

  if (q.lebarMin !== null && p.lebar < q.lebarMin) return false;

  if (q.hargaMax !== null && p.price > q.hargaMax) return false;

  if (q.tipe !== "semua" && p.tipe !== q.tipe) return false;

  if (q.status !== "semua" && p.status !== q.status) return false;

  if (q.carport === "ya" && !p.carport) return false;
  if (q.carport === "tidak" && p.carport) return false;

  return true;
}

function sortRows(rows: Property[], sort: ListingQuery["sort"]): Property[] {
  const byDateDesc = (a: Property, b: Property) =>
    +new Date(b.created_at) - +new Date(a.created_at);

  switch (sort) {
    case "nama":
      return rows.sort((a, b) =>
        a.nama_property.localeCompare(b.nama_property, "id")
      );
    case "harga_asc":
      return rows.sort((a, b) => a.price - b.price);
    case "harga_desc":
      return rows.sort((a, b) => b.price - a.price);
    case "status":
      return rows.sort((a, b) => {
        if (a.status !== b.status) return a.status === "in_stock" ? -1 : 1;
        return byDateDesc(a, b);
      });
    case "tanggal":
    default:
      return rows.sort(byDateDesc);
  }
}

export function applyListingQuery(
  all: Property[],
  q: ListingQuery
): ListingResult {
  const filtered = all.filter((p) => matches(p, q));
  const sorted = sortRows([...filtered], q.sort);

  const total = sorted.length;
  const perPage = q.perPage;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, q.page), totalPages);
  const start = (page - 1) * perPage;
  const rows = sorted.slice(start, start + perPage);

  return { rows, total, page, perPage, totalPages };
}

/** Count of active filters (for the "Reset" affordance / chips summary). */
export function activeFilterCount(q: ListingQuery): number {
  let n = 0;
  if (q.search.trim()) n++;
  n += q.kawasan.length ? 1 : 0;
  n += q.hadap.length ? 1 : 0;
  n += q.siap.length ? 1 : 0;
  if (q.lebarMin !== null) n++;
  if (q.hargaMax !== null) n++;
  if (q.tipe !== "semua") n++;
  if (q.status !== "semua") n++;
  if (q.carport !== "semua") n++;
  return n;
}
