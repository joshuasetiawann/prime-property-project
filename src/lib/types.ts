// =========================================================================
// Prime Property — Domain types
// =========================================================================

export type Role = "admin" | "superadmin";

export type Tipe = "ruko" | "villa";

export type Status = "in_stock" | "sold_out";

export type Siap = "siap_huni" | "siap_kosong" | "siap_huni_renovasi";

export type Hadap = "Utara" | "Selatan" | "Timur" | "Barat";

export interface Property {
  id: string;
  nama_property: string;
  group: string | null;
  lebar: number; // meters (decimal)
  panjang: number; // meters (decimal)
  hadap: Hadap[]; // multi
  tipe: Tipe;
  tingkat: number; // floors (decimal, e.g. 2.5)
  price: number; // full rupiah, integer
  carport: boolean;
  status: Status;
  siap: Siap;
  maps_link: string | null;
  kawasan: string[]; // multi-tag
  unit: string | null;
  imageUrl: string | null; // display-only marketplace visual (not an upload)
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by: string; // user display name
  deleted_at: string | null; // soft delete
}

/** Payload accepted by create/update endpoints (server assigns the rest). */
export interface PropertyInput {
  nama_property: string;
  group: string | null;
  lebar: number;
  panjang: number;
  hadap: Hadap[];
  tipe: Tipe;
  tingkat: number;
  price: number;
  carport: boolean;
  status: Status;
  siap: Siap;
  maps_link: string | null;
  kawasan: string[];
  unit: string | null;
  imageUrl: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  passwordHash: string;
  created_at: string;
  last_login_at: string | null;
}

/** User shape exposed to the client (never includes the password hash). */
export type PublicUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "active" | "created_at" | "last_login_at"
>;

export type AuditAction =
  | "login"
  | "logout"
  | "create_property"
  | "update_property"
  | "delete_property"
  | "create_admin"
  | "toggle_admin"
  | "reset_password";

export interface AuditChange {
  field: string;
  from: string;
  to: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string; // user display name
  actorRole: Role;
  action: AuditAction;
  target: string; // property/admin name
  summary: string;
  changes?: AuditChange[];
}

// — Listing query types (shared by client + API) —

export type SortKey =
  | "nama"
  | "harga_asc"
  | "harga_desc"
  | "tanggal"
  | "status";

export type CarportFilter = "semua" | "ya" | "tidak";
export type TipeFilter = "semua" | Tipe;
export type StatusFilter = "semua" | Status;

export interface ListingQuery {
  search: string;
  kawasan: string[];
  hadap: Hadap[];
  siap: Siap[];
  lebarMin: number | null;
  hargaMax: number | null;
  tipe: TipeFilter;
  status: StatusFilter;
  carport: CarportFilter;
  sort: SortKey;
  page: number;
  perPage: number;
}

export interface ListingResult {
  rows: Property[];
  total: number; // total matching (after filters)
  page: number;
  perPage: number;
  totalPages: number;
}
