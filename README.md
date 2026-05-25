<div align="center">

# Prime Property

**Platform web & portal agen internal untuk agensi properti premium.**

Landing · Tentang Kami · Kontak · Portal Agen (listing, CRUD, role-based access)

</div>

---

Prime Property adalah platform web lengkap untuk agensi properti premium: situs
publik yang elegan plus portal internal dengan manajemen listing, kontrol akses
berbasis peran (Admin / Superadmin), filter & pencarian bertenaga, dan audit log.

Dibangun dengan **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4**.

## ✨ Sorotan

- **Desain premium** — sistem warna brand (Hitam `#1A1A1A`, Emas `#C9A961`, Merah
  `#B33A3A`), tipografi editorial (Cormorant Garamond display + Geist sans),
  motif arsitektural, dan animasi halus.
- **Logo brand** sebagai SVG vektor yang tajam di segala ukuran & adaptif untuk
  latar terang/gelap. Tampil di header & footer **semua** halaman publik dan
  dashboard internal.
- **Backend authorization sungguhan** — admin yang mencoba endpoint mutasi
  menerima **403 Forbidden** dari server (bukan sekadar UI yang disembunyikan).
- **Sesi httpOnly cookie**, lockout login, rate limiting, dan proteksi CSRF.
- **Bahasa Indonesia** penuh, format Rupiah (`Rp 1.350.000.000`) & tanggal WIB.

## 🚀 Menjalankan secara lokal

```bash
npm install          # instal dependensi
npm run dev          # mode pengembangan  → http://localhost:3000
```

Perintah lain:

```bash
npm run build        # build produksi
npm start            # jalankan hasil build
npm run lint         # ESLint
```

> Butuh **Node.js 18.18+** (direkomendasikan 20/22). Tidak ada variabel
> lingkungan atau database yang wajib diisi untuk demo — data di-seed otomatis.

### URL utama

| Area | URL |
| --- | --- |
| Beranda | `http://localhost:3000/` |
| Tentang Kami | `http://localhost:3000/tentang-kami` |
| Kontak | `http://localhost:3000/kontak` |
| Login Agen | `http://localhost:3000/agent/login` |
| Dashboard | `http://localhost:3000/agent/dashboard` |

## 🔑 Akun demo

Tidak ada registrasi mandiri — akun dibuat oleh superadmin. Untuk demo:

| Peran | Email | Password |
| --- | --- | --- |
| **Superadmin** | `superadmin@primeproperty.id` | `Prime2026!` |
| **Admin** | `admin@primeproperty.id` | `Prime2026!` |

Di halaman login tersedia tombol isi-otomatis untuk kedua akun.

## 🗺️ Rute

**Publik**

- `/` — Landing (hero, properti unggulan, mengapa Prime Property)
- `/tentang-kami` — Profil, visi, misi, nilai
- `/kontak` — Info kontak + form (validasi & toast) + peta

**Portal Agen** (`/agent/*`, dilindungi)

- `/agent/login` — Login
- `/agent/dashboard` — Tabel listing + filter, pencarian, sort, paginasi, drawer
- `/agent/properti/[id]` — Detail properti
- `/agent/properti/baru` — Tambah properti *(superadmin)*
- `/agent/properti/[id]/edit` — Edit properti *(superadmin)*
- `/agent/admin` — Manajemen akun admin *(superadmin)*
- `/agent/audit` — Audit log *(superadmin)*

**API** — `/api/auth/{login,logout,me}`, `/api/properties[/:id]`,
`/api/admins[/:id]`, `/api/audit`, `/api/contact`.

## 🎨 Brand & logo

- Komponen brand: `src/components/brand/Logomark.tsx` (emblem) &
  `Logo.tsx` (lockup penuh + wordmark). Favicon: `public/favicon.svg`.
- **Logo digunakan di:** header publik (`PublicHeader`), footer publik
  (`PublicFooter`), halaman login, sidebar & topbar portal (`PortalShell`),
  halaman 404, serta sebagai watermark pada hero/kartu.
- **Footer copyright** `© 2026 Prime Property. All rights reserved.` ada di
  `PublicFooter` (dipakai di semua halaman publik) dan di panel brand halaman
  login.

> Catatan: berkas logo asli yang diunggah tidak tersedia di filesystem saat
> build, sehingga emblem direkonstruksi sebagai SVG vektor yang setia pada DNA
> brand (bilah emas naik, garis merah kembar, puncak/“P” hitam). Untuk mengganti
> dengan aset final, ganti isi `Logomark.tsx`/`favicon.svg`.

## 🧱 Model data properti

`nama_property, group, lebar, panjang, hadap[], tipe, tingkat, price, carport,
status, siap, maps_link, kawasan[], unit, created_at, updated_at, created_by`
(+ `deleted_at` untuk soft delete). Lihat `src/lib/types.ts`.

Harga disimpan sebagai **integer rupiah penuh**; ditampilkan `Rp 1.350.000.000`.
Tanggal ditampilkan `24 Mei 2026` / `24/05/2026` (zona **Asia/Jakarta**).

## 🔐 Keamanan & otorisasi

- **Sesi**: token acak di cookie `httpOnly`, `SameSite=Lax`, masa berlaku 30
  hari, `Secure` di produksi.
- **Authorization backend**: setiap endpoint mutasi properti & seluruh fitur
  superadmin diperiksa di server (`requireSuperadmin`). Admin → `403`.
- **Lockout**: 5 gagal login dalam 30 menit → terkunci 15 menit.
- **Rate limit**: auth 10 req/menit/IP, kontak 3 submit/jam/IP.
- **CSRF**: mutasi memeriksa kecocokan `Origin` + cookie `SameSite=Lax`.
- **Password**: hash **bcrypt** (cost 10).

## 🔌 Catatan integrasi backend (untuk produksi)

Demo ini memakai **store in-memory** (`src/lib/store.ts`) yang di-seed otomatis
(60 properti, 3 user). State bertahan selama proses dev berjalan, tetapi
**reset** saat server restart / di lingkungan serverless. Untuk produksi:

1. Ganti `store.ts` dengan database nyata (PostgreSQL + Prisma/Drizzle).
   Antarmuka akses data sudah terpusat di `src/lib/properties.ts`,
   `src/lib/admins.ts`, dan `src/lib/auth.ts` — cukup ganti implementasinya.
2. Pindahkan sesi & rate-limit ke penyimpanan persisten (mis. Redis).
3. Hubungkan `/api/contact` ke layanan email transaksional.
4. Soft delete sudah didukung (`deleted_at`); tambahkan menu “Arsip” (Phase 2)
   bila diperlukan.

## 📋 Pemetaan acceptance criteria

Ringkasan implementasi tersedia di [`docs/ACCEPTANCE.md`](docs/ACCEPTANCE.md).
Panduan superadmin di [`docs/SUPERADMIN.md`](docs/SUPERADMIN.md).

## 🧩 Struktur proyek

```
src/
├─ app/
│  ├─ page.tsx            # Landing (Beranda)
│  ├─ tentang-kami/       # About Us
│  ├─ kontak/             # Contact Us
│  ├─ agent/login/        # login portal
│  ├─ agent/(portal)/*    # dashboard, properti, admin, audit (dilindungi)
│  └─ api/*               # route handlers
├─ components/
│  ├─ brand/              # Logo, Logomark
│  ├─ public/             # header, footer, hero pieces, contact form
│  ├─ portal/             # dashboard, tabel, filter, form, dll.
│  └─ ui/                 # Button, Field, Modal, Drawer, Toast, Badge…
├─ lib/                   # types, format, validation, auth, store, data
└─ proxy.ts               # gate edge untuk /agent/*
```

---

<div align="center">
© 2026 Prime Property. All rights reserved.
</div>
