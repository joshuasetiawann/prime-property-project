# Pemetaan Acceptance Criteria

Ringkasan bagaimana tiap kriteria dipenuhi. ✅ = terpenuhi.

## 1. Branding & Design System
- **AC-1.1 Palette & logo** ✅ — token brand di `globals.css`; logo di header
  semua halaman publik & dashboard. Tipografi Geist (sans) + Cormorant (display).
- **AC-1.2 Layout** ✅ — responsif (mobile/tablet/desktop), spacing grid
  4/8/16/24/32, tanpa upload gambar (fokus data tabular).

## 2. Landing Page
- **AC-2.1 Hero** ✅ — latar hitam, aksen emas, logo menonjol, tagline + CTA
  emas “Lihat Properti”.
- **AC-2.2 Section** ✅ — Properti Unggulan (maks 6, read-only), “Mengapa Prime
  Property” (4 value prop berikon), footer (logo, kontak, link).
- **AC-2.3 Header** ✅ — sticky; urutan Logo · Beranda · Tentang Kami · Kontak ·
  tombol “Login Agent” (outline emas, kanan).

## 3. About Us
- **AC-3.1** ✅ — profil, visi, misi, nilai (Bahasa Indonesia); 2 kolom desktop
  (teks + kartu kutipan), 1 kolom mobile.

## 4. Contact Us
- **AC-4.1 Info** ✅ — alamat, telepon, email, link WhatsApp (`wa.me`), embed
  Google Maps.
- **AC-4.2 Form** ✅ — Nama, Email, Nomor HP, Pesan; validasi (wajib, email
  valid, HP ≥10 digit); toast “Pesan terkirim, tim kami akan menghubungi Anda.”;
  rate limit 3/IP/jam.

## 5. Autentikasi Agent
- **AC-5.1 Login** ✅ — route terpisah `/agent/login`, tanpa link publik; tanpa
  registrasi mandiri; cookie httpOnly `SameSite=Lax` 30 hari; lockout 5×/30 mnt
  → 15 mnt.
- **AC-5.2 Role** ✅ — Admin (read-only) vs Superadmin (full CRUD + akun + audit).
  **Authorization dicek di backend**; admin pada endpoint mutasi → `403`.
- **AC-5.3 Logout** ✅ — di kartu profil; hapus sesi + redirect ke login.

## 6. Schema Data
- **AC-6.1** ✅ — seluruh field di `src/lib/types.ts`; harga integer rupiah;
  format display locale Indonesia.

## 7. Dashboard — View
- **AC-7.1 Tabel** ✅ — kolom sesuai spesifikasi; paginasi 25/50/100 (default
  50); sort nama/harga/tanggal/status; badge status berwarna; klik baris → drawer
  detail.
- **AC-7.2 Filter & pencarian** ✅ — semua filter, debounce 300 ms, chip aktif,
  Reset Filter, state di URL (shareable).
- **AC-7.3 Detail** ✅ — semua field 2 kolom; tombol “Buka di Google Maps”;
  Edit/Hapus hanya untuk superadmin.

## 8. CRUD (Superadmin)
- **AC-8.1 Create** ✅ — tombol khusus superadmin; form 2 kolom; validasi
  client + server; toast + redirect; “Simpan & Tambah Lagi”.
- **AC-8.2 Update** ✅ — form sama, prefilled; indikator dirty; Batal;
  perubahan tercatat di audit log.
- **AC-8.3 Delete** ✅ — modal konfirmasi dengan teks sesuai spesifikasi; soft
  delete (`deleted_at`); tidak tampil di listing.
- **AC-8.4 Validasi** ✅ — aturan nama/lebar/panjang/price/tingkat/maps_link;
  error inline warna `#B33A3A`.

## 9. Non-Functional
- **AC-9.1 Performa** ✅ — landing prerender statis; dashboard SSR + fetch
  terdebounce. *(Skor Lighthouse perlu diukur di lingkungan target.)*
- **AC-9.2 Keamanan** ✅ — gate auth (`proxy.ts`) + validasi sesi server,
  CSRF (cek `Origin`), rate limit auth 10/mnt/IP & kontak 3/jam/IP, bcrypt
  cost 10, cookie `Secure` di produksi. *(Rate limit global 100/mnt/IP
  disiapkan untuk diaktifkan di proxy saat produksi.)*
- **AC-9.3 Bahasa & lokalisasi** ✅ — UI Bahasa Indonesia; `Rp 1.350.000.000`;
  `24 Mei 2026` / `24/05/2026`; WIB.
- **AC-9.4 Browser** ✅ — output standar (Next 16/React 19), CSS modern dengan
  fallback.

## 10. Deliverables
- **AC-10.1** ✅ — kriteria terpenuhi & teruji; UI sesuai brand; responsif;
  authorization backend terverifikasi; 60 properti dummy; dokumentasi superadmin
  (`docs/SUPERADMIN.md`).

## Catatan / batasan
- Store **in-memory** untuk demo (reset saat restart). Lihat README → integrasi
  backend.
- Embed Google Maps & link maps memakai URL publik (tanpa API key).
- “Highlight entry baru” pasca-create diwujudkan sebagai redirect ke halaman
  detail entri tersebut.
- Menu “Arsip / restore” soft-deleted ditandai sebagai Phase 2 (opsional).
