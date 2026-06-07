import type { Hadap, PropertyInput, Siap, Status, Tipe } from "./types";
import { parseRupiah } from "./format";

const HADAP_VALUES: Hadap[] = ["Utara", "Selatan", "Timur", "Barat"];
const SIAP_VALUES: Siap[] = [
  "siap_huni",
  "siap_kosong",
  "siap_huni_renovasi",
];

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

function strOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}

/** Coerce raw JSON (from a form / API body) into a typed PropertyInput. */
export function coercePropertyInput(raw: Record<string, unknown>): PropertyInput {
  const priceRaw = raw.price;
  const price =
    typeof priceRaw === "string"
      ? parseRupiah(priceRaw) ?? NaN
      : num(priceRaw);

  return {
    nama_property: String(raw.nama_property ?? "").trim(),
    group: strOrNull(raw.group),
    lebar: num(raw.lebar),
    panjang: num(raw.panjang),
    hadap: Array.isArray(raw.hadap)
      ? (raw.hadap.filter((h) => HADAP_VALUES.includes(h as Hadap)) as Hadap[])
      : [],
    tipe: (raw.tipe === "ruko" || raw.tipe === "villa"
      ? raw.tipe
      : "") as Tipe,
    tingkat: num(raw.tingkat),
    price,
    carport: Boolean(raw.carport),
    status: (raw.status === "in_stock" || raw.status === "sold_out"
      ? raw.status
      : "") as Status,
    siap: (SIAP_VALUES.includes(raw.siap as Siap) ? raw.siap : "") as Siap,
    maps_link: strOrNull(raw.maps_link),
    kawasan: Array.isArray(raw.kawasan)
      ? (raw.kawasan.filter((k) => typeof k === "string") as string[])
      : [],
    unit: strOrNull(raw.unit),
    imageUrl: strOrNull(raw.imageUrl),
  };
}

// =========================================================================
// Shared validation (client = instant feedback, server = security).
// Returns a map of field -> error message (empty map === valid).
// =========================================================================

export type Errors = Record<string, string>;

function decimals(n: number): number {
  if (Number.isInteger(n)) return 0;
  const s = String(n);
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}

export function validateProperty(input: Partial<PropertyInput>): Errors {
  const e: Errors = {};

  // nama_property: 3–100 chars
  const nama = (input.nama_property ?? "").trim();
  if (!nama) e.nama_property = "Nama properti wajib diisi.";
  else if (nama.length < 3) e.nama_property = "Minimum 3 karakter.";
  else if (nama.length > 100) e.nama_property = "Maksimum 100 karakter.";

  // lebar & panjang: > 0, max 2 decimals
  for (const key of ["lebar", "panjang"] as const) {
    const v = input[key];
    if (v === undefined || v === null || Number.isNaN(v)) {
      e[key] = "Wajib diisi.";
    } else if (v <= 0) {
      e[key] = "Harus lebih dari 0.";
    } else if (decimals(v) > 2) {
      e[key] = "Maksimum 2 angka desimal.";
    }
  }

  // tingkat: 1–10, max 1 decimal
  const tingkat = input.tingkat;
  if (tingkat === undefined || tingkat === null || Number.isNaN(tingkat)) {
    e.tingkat = "Wajib diisi.";
  } else if (tingkat < 1 || tingkat > 10) {
    e.tingkat = "Rentang 1 – 10.";
  } else if (decimals(tingkat) > 1) {
    e.tingkat = "Maksimum 1 angka desimal.";
  }

  // price: > 0, integer rupiah
  const price = input.price;
  if (price === undefined || price === null || Number.isNaN(price)) {
    e.price = "Harga wajib diisi.";
  } else if (price <= 0) {
    e.price = "Harga harus lebih dari 0.";
  } else if (!Number.isInteger(price)) {
    e.price = "Harga harus berupa rupiah bulat.";
  }

  // tipe / status / siap
  if (input.tipe !== "ruko" && input.tipe !== "villa")
    e.tipe = "Pilih tipe properti.";
  if (input.status !== "in_stock" && input.status !== "sold_out")
    e.status = "Pilih status.";
  if (
    input.siap !== "siap_huni" &&
    input.siap !== "siap_kosong" &&
    input.siap !== "siap_huni_renovasi"
  )
    e.siap = "Pilih kondisi kesiapan.";

  // hadap: ≥1
  if (!input.hadap || input.hadap.length === 0)
    e.hadap = "Pilih minimal satu arah hadap.";

  // kawasan: ≥1
  if (!input.kawasan || input.kawasan.length === 0)
    e.kawasan = "Pilih minimal satu kawasan.";

  // maps_link: valid URL containing google.com/maps (optional)
  const maps = (input.maps_link ?? "").trim();
  if (maps) {
    let ok = false;
    try {
      const url = new URL(maps);
      ok =
        /(^|\.)google\.[a-z.]+$/i.test(url.hostname) &&
        /maps/i.test(url.pathname + url.search);
    } catch {
      ok = false;
    }
    if (!ok)
      e.maps_link = "Harus URL Google Maps yang valid (mengandung google.com/maps).";
  }

  return e;
}

// — Contact form (AC-4.2) —

export interface ContactInput {
  nama: string;
  email: string;
  nomor_hp: string;
  pesan: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: Partial<ContactInput>): Errors {
  const e: Errors = {};
  const nama = (input.nama ?? "").trim();
  const email = (input.email ?? "").trim();
  const hp = (input.nomor_hp ?? "").trim();
  const pesan = (input.pesan ?? "").trim();

  if (!nama) e.nama = "Nama wajib diisi.";
  else if (nama.length < 2) e.nama = "Nama terlalu pendek.";

  if (!email) e.email = "Email wajib diisi.";
  else if (!EMAIL_RE.test(email)) e.email = "Format email tidak valid.";

  const digits = hp.replace(/\D/g, "");
  if (!hp) e.nomor_hp = "Nomor HP wajib diisi.";
  else if (digits.length < 10) e.nomor_hp = "Nomor HP minimal 10 digit.";

  if (!pesan) e.pesan = "Pesan wajib diisi.";
  else if (pesan.length < 10) e.pesan = "Pesan minimal 10 karakter.";

  return e;
}

export function hasErrors(e: Errors): boolean {
  return Object.keys(e).length > 0;
}
