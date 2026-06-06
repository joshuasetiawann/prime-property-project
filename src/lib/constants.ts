import type {
  Hadap,
  Siap,
  Status,
  Tipe,
  ListingQuery,
} from "./types";

// — Domain option sets (single source of truth for labels) —

export const KAWASAN_OPTIONS = [
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
] as const;

export const HADAP_OPTIONS: Hadap[] = ["Utara", "Selatan", "Timur", "Barat"];

export const TIPE_OPTIONS: { value: Tipe; label: string }[] = [
  { value: "ruko", label: "Ruko" },
  { value: "villa", label: "Villa" },
];

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "sold_out", label: "Sold Out" },
];

export const SIAP_OPTIONS: { value: Siap; label: string }[] = [
  { value: "siap_huni", label: "Siap Huni" },
  { value: "siap_kosong", label: "Siap Kosong" },
  { value: "siap_huni_renovasi", label: "Siap Huni Renovasi" },
];

export const SORT_OPTIONS: { value: ListingQuery["sort"]; label: string }[] = [
  { value: "nama", label: "Nama (A–Z)" },
  { value: "harga_asc", label: "Harga · Terendah" },
  { value: "harga_desc", label: "Harga · Tertinggi" },
  { value: "tanggal", label: "Tanggal Dibuat" },
  { value: "status", label: "Status" },
];

export const PER_PAGE_OPTIONS = [25, 50, 100] as const;

export const DEFAULT_QUERY: ListingQuery = {
  search: "",
  kawasan: [],
  hadap: [],
  siap: [],
  lebarMin: null,
  hargaMax: null,
  tipe: "semua",
  status: "semua",
  carport: "semua",
  sort: "tanggal",
  page: 1,
  perPage: 50,
};

// — Human-readable label maps —

export const TIPE_LABEL: Record<Tipe, string> = {
  ruko: "Ruko",
  villa: "Villa",
};

export const STATUS_LABEL: Record<Status, string> = {
  in_stock: "In Stock",
  sold_out: "Sold Out",
};

export const SIAP_LABEL: Record<Siap, string> = {
  siap_huni: "Siap Huni",
  siap_kosong: "Siap Kosong",
  siap_huni_renovasi: "Siap Huni Renovasi",
};

// — Company / contact details (placeholders, centralised) —

export const COMPANY = {
  name: "Prime Property",
  legalName: "PT Prime Property Indonesia",
  tagline: "Properti Premium, Layanan Terpercaya",
  phoneDisplay: "+62 811 6000 700",
  phoneHref: "tel:+628116000700",
  whatsappNumber: "628116000700",
  whatsappHref: "https://wa.me/628116000700",
  email: "halo@primeproperty.id",
  emailHref: "mailto:halo@primeproperty.id",
  addressLines: [
    "Prime Property Tower, Lantai 12",
    "Jl. Imam Bonjol No. 88",
    "Medan, Sumatera Utara 20152",
  ],
  mapsEmbedQuery: "Jl. Imam Bonjol No. 88 Medan",
  hours: "Senin – Sabtu · 09.00 – 18.00 WIB",
} as const;
