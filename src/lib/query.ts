import { DEFAULT_QUERY } from "./constants";
import type {
  CarportFilter,
  Hadap,
  ListingQuery,
  Siap,
  SortKey,
  StatusFilter,
  TipeFilter,
} from "./types";

// =========================================================================
// ListingQuery <-> URLSearchParams (shareable, debounced filter state).
// =========================================================================

const HADAP_SET: Hadap[] = ["Utara", "Selatan", "Timur", "Barat"];
const SIAP_SET: Siap[] = ["siap_huni", "siap_kosong", "siap_huni_renovasi"];
const SORT_SET: SortKey[] = [
  "nama",
  "harga_asc",
  "harga_desc",
  "tanggal",
  "status",
];

type ParamSource = URLSearchParams | Record<string, string | undefined>;

function read(src: ParamSource, key: string): string | undefined {
  if (src instanceof URLSearchParams) return src.get(key) ?? undefined;
  return src[key];
}

function splitList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseListingQuery(src: ParamSource): ListingQuery {
  const q: ListingQuery = { ...DEFAULT_QUERY };

  const search = read(src, "q");
  if (search) q.search = search;

  q.kawasan = splitList(read(src, "kawasan"));
  q.hadap = splitList(read(src, "hadap")).filter((h): h is Hadap =>
    HADAP_SET.includes(h as Hadap)
  );
  q.siap = splitList(read(src, "siap")).filter((s): s is Siap =>
    SIAP_SET.includes(s as Siap)
  );

  const lebarMin = read(src, "lebarMin");
  if (lebarMin && !Number.isNaN(Number(lebarMin))) q.lebarMin = Number(lebarMin);

  const hargaMax = read(src, "hargaMax");
  if (hargaMax && !Number.isNaN(Number(hargaMax))) q.hargaMax = Number(hargaMax);

  const tipe = read(src, "tipe");
  if (tipe === "ruko" || tipe === "villa" || tipe === "semua")
    q.tipe = tipe as TipeFilter;

  const status = read(src, "status");
  if (status === "in_stock" || status === "sold_out" || status === "semua")
    q.status = status as StatusFilter;

  const carport = read(src, "carport");
  if (carport === "ya" || carport === "tidak" || carport === "semua")
    q.carport = carport as CarportFilter;

  const sort = read(src, "sort");
  if (sort && SORT_SET.includes(sort as SortKey)) q.sort = sort as SortKey;

  const page = read(src, "page");
  if (page && Number(page) > 0) q.page = Math.floor(Number(page));

  const perPage = read(src, "perPage");
  if (perPage && [25, 50, 100].includes(Number(perPage)))
    q.perPage = Number(perPage);

  return q;
}

/** Serialize to a clean URLSearchParams (omits defaults). */
export function serializeListingQuery(q: ListingQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (q.search.trim()) params.set("q", q.search.trim());
  if (q.kawasan.length) params.set("kawasan", q.kawasan.join(","));
  if (q.hadap.length) params.set("hadap", q.hadap.join(","));
  if (q.siap.length) params.set("siap", q.siap.join(","));
  if (q.lebarMin !== null) params.set("lebarMin", String(q.lebarMin));
  if (q.hargaMax !== null) params.set("hargaMax", String(q.hargaMax));
  if (q.tipe !== "semua") params.set("tipe", q.tipe);
  if (q.status !== "semua") params.set("status", q.status);
  if (q.carport !== "semua") params.set("carport", q.carport);
  if (q.sort !== DEFAULT_QUERY.sort) params.set("sort", q.sort);
  if (q.page !== 1) params.set("page", String(q.page));
  if (q.perPage !== DEFAULT_QUERY.perPage)
    params.set("perPage", String(q.perPage));
  return params;
}

export function queryToString(q: ListingQuery): string {
  const s = serializeListingQuery(q).toString();
  return s ? `?${s}` : "";
}
