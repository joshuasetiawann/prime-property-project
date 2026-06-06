import type { Hadap, Property, Siap, Status, Tipe } from "./types";

// =========================================================================
// Deterministic seed data — 60 realistic listings.
// Generated from a fixed seed so the dataset is stable across reloads
// (no hydration mismatches, reproducible for QA per AC-10.1).
// =========================================================================

// Fixed reference "today" keeps generated timestamps stable.
const BASE = Date.UTC(2026, 5, 6, 4, 0, 0); // 2026-06-06, ~11:00 WIB
const DAY = 86_400_000;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VILLA_NAMES = [
  "Aston Villas",
  "Banyan Tree",
  "The Hampton",
  "Cemara Hills",
  "Green Sanctuary",
  "Royal Garden",
  "Bukit Indah",
  "Serene Park",
  "Maple Residence",
  "Emerald Bay",
  "Savana Heights",
  "Putri Hijau Villa",
  "Grand Mutiara",
  "Taman Anggrek",
  "Lavender House",
  "Northwood",
  "Casa Verde",
  "Bukit Cemara",
  "Permata Hijau",
  "The Arbor",
];

const RUKO_NAMES = [
  "Prime Square",
  "Sentra Niaga",
  "Boulevard Commercial",
  "Grand Galaxy",
  "Mega Trade Center",
  "City Walk",
  "Sudirman Business Park",
  "Crystal Arcade",
  "Pinangsia Trade",
  "Gold Coast Ruko",
  "Metro Junction",
  "Plaza Niaga",
  "The Exchange",
  "Centro Bisnis",
  "Marvel Commercial",
];

const BLOK = ["A", "B", "C", "D", "E", "F"];
const GROUPS = [
  "Mentari",
  "Permai 123",
  "Project Ville",
  "Cluster Anggrek",
  "Royal Estate",
  "Sunrise",
  null,
  null,
];
const KAWASAN = [
  "Krakatau",
  "Pancing",
  "Cemara Asri",
  "Kuala",
  "Tembung",
  "Helvetia",
  "Setia Budi",
  "Johor",
  "Marelan",
  "Sunggal",
];
const HADAP: Hadap[] = ["Utara", "Selatan", "Timur", "Barat"];
const SIAP: Siap[] = ["siap_huni", "siap_kosong", "siap_huni_renovasi"];
const UNITS_VILLA = [
  "Ready Siap huni",
  "Gate siap",
  "Lapangan",
  null,
  null,
];
const UNITS_RUKO = ["Rucon", "Gate siap", "Ready Siap huni", null, null];
const CREATORS = ["Sutan Pradana", "Maya Lestari", "Reza Anugrah"];

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Builds the full deterministic seed list (newest first by created_at). */
export function seedProperties(): Property[] {
  const rng = mulberry32(20260524);
  const out: Property[] = [];
  const total = 60;

  for (let i = 0; i < total; i++) {
    const isVilla = rng() > 0.45;
    const tipe: Tipe = isVilla ? "villa" : "ruko";

    const baseName = isVilla
      ? VILLA_NAMES[i % VILLA_NAMES.length]
      : RUKO_NAMES[i % RUKO_NAMES.length];
    const withBlok = rng() > 0.6;
    const nama_property = withBlok
      ? `${baseName} (Blok ${pick(rng, BLOK)})`
      : baseName;

    const group = pick(rng, GROUPS);

    // Dimensions — villas wider/longer on average.
    const lebar = isVilla
      ? round2(5 + rng() * 4) // 5–9 m
      : round2(4 + rng() * 2.5); // 4–6.5 m
    const panjang = isVilla
      ? round2(15 + rng() * 12) // 15–27 m
      : round2(11 + rng() * 9); // 11–20 m

    // 1–2 facings.
    const hadapCount = rng() > 0.7 ? 2 : 1;
    const hadap: Hadap[] = [];
    while (hadap.length < hadapCount) {
      const h = pick(rng, HADAP);
      if (!hadap.includes(h)) hadap.push(h);
    }

    const tingkatChoices = isVilla ? [1, 1.5, 2, 2.5] : [2, 2.5, 3, 3.5];
    const tingkat = pick(rng, tingkatChoices);

    // Price correlated to area + premium per type.
    const area = lebar * panjang;
    const perM2 = isVilla ? 9_000_000 + rng() * 7_000_000 : 13_000_000 + rng() * 10_000_000;
    const rawPrice = area * perM2 * (0.9 + tingkat * 0.18);
    const price = Math.round(rawPrice / 5_000_000) * 5_000_000; // round to 5 juta

    const carport = isVilla ? rng() > 0.25 : rng() > 0.6;
    const status: Status = rng() > 0.72 ? "sold_out" : "in_stock";
    const siap = pick(rng, SIAP);

    // 1–2 kawasan tags.
    const kawasanCount = rng() > 0.8 ? 2 : 1;
    const kawasan: string[] = [];
    while (kawasan.length < kawasanCount) {
      const k = pick(rng, KAWASAN);
      if (!kawasan.includes(k)) kawasan.push(k);
    }

    const unit = isVilla ? pick(rng, UNITS_VILLA) : pick(rng, UNITS_RUKO);
    const hasMaps = rng() > 0.25;
    const maps_link = hasMaps
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${baseName} ${kawasan[0]} Medan`
        )}`
      : null;

    const createdOffset = Math.floor(rng() * 180) + 1; // 1–180 days ago
    const created = BASE - createdOffset * DAY - Math.floor(rng() * DAY);
    const updatedDelta = Math.floor(rng() * createdOffset) * DAY;
    const updated = created + updatedDelta;

    out.push({
      id: `PRP-${String(i + 1).padStart(4, "0")}`,
      nama_property,
      group,
      lebar,
      panjang,
      hadap,
      tipe,
      tingkat,
      price,
      carport,
      status,
      siap,
      maps_link,
      kawasan,
      unit,
      created_at: new Date(created).toISOString(),
      updated_at: new Date(updated).toISOString(),
      created_by: pick(rng, CREATORS),
      deleted_at: null,
    });
  }

  // Newest first.
  out.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return out;
}
