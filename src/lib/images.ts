import type { Property, Tipe } from "./types";

// =========================================================================
// Property imagery (display-only — NOT an upload feature).
//
// These bundled, brand-tuned real-estate visuals live in /public/properties
// so they always render (no external dependency). In production, set a
// property's `imageUrl` to a real photo CDN — `resolvePropertyImage` will
// prefer it and gracefully fall back to a bundled visual.
// =========================================================================

export const PROPERTY_IMAGES = Array.from(
  { length: 16 },
  (_, i) => `/properties/p${String(i + 1).padStart(2, "0")}.jpg`
);

// Bundled scenes by archetype (1-based indices in the pool).
const RESIDENTIAL = [1, 5, 9, 13, 4, 8, 12, 16]; // villa + house scenes
const COMMERCIAL = [2, 6, 10, 14, 3, 7, 11, 15]; // ruko + tower scenes

function hash(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic bundled visual for a property archetype + key. */
export function imageForProperty(tipe: Tipe, key: string): string {
  const pool = tipe === "ruko" ? COMMERCIAL : RESIDENTIAL;
  const idx = pool[hash(key) % pool.length] - 1;
  return PROPERTY_IMAGES[idx];
}

/** Preferred image for a property (explicit imageUrl, else bundled visual). */
export function resolvePropertyImage(
  p: Pick<Property, "imageUrl" | "tipe" | "id">
): string {
  return p.imageUrl || imageForProperty(p.tipe, p.id);
}
