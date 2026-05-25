# Panduan Superadmin — Prime Property

Panduan singkat mengelola properti dan akun melalui Portal Agen.

## Masuk

1. Buka `/agent/login`.
2. Masuk dengan akun superadmin (`superadmin@primeproperty.id` / `Prime2026!`
   pada demo).
3. Anda diarahkan ke **Dashboard Properti**. Lencana **Superadmin** tampil di
   sidebar/topbar.

## Mengelola properti

### Menambah properti

1. Klik **+ Tambah Properti** (kanan atas dashboard).
2. Isi formulir. Kolom bertanda `*` wajib. Validasi tampil langsung di bawah
   kolom yang bermasalah.
   - **Harga** otomatis diformat ribuan (`1.350.000.000`).
   - **Hadap** & **Kawasan** mendukung pilihan ganda.
3. Klik **Simpan** untuk menyimpan dan membuka detail, atau
   **Simpan & Tambah Lagi** untuk input beruntun.

### Mengubah properti

1. Buka properti → **Edit** (atau Edit dari drawer detail di dashboard).
2. Kolom yang berubah ditandai titik emas, dengan ringkasan
   “_n_ perubahan belum disimpan”.
3. **Simpan** untuk menyimpan, **Batal** untuk kembali tanpa menyimpan.
   Setiap perubahan tercatat di **Audit Log** (siapa, kapan, apa).

### Menghapus properti

1. Dari detail atau drawer, klik **Hapus**.
2. Konfirmasi pada modal: _“Yakin hapus properti [nama]? Tindakan ini tidak
   dapat dibatalkan.”_
3. Penghapusan bersifat **soft delete** — data tidak hilang permanen dan tidak
   lagi muncul di listing.

> **Admin** (non-superadmin) hanya dapat melihat, memfilter, dan membuka detail.
> Tombol Tambah/Edit/Hapus tidak tampil, dan endpoint mutasi menolak permintaan
> mereka dengan `403`.

## Mencari & memfilter

- **Pencarian** mencakup nama, group, dan kawasan (debounce 300 ms).
- **Filter**: Kawasan, Hadap, Siap (multi-pilih), Lebar min, Harga maks, Tipe,
  Status, Carport.
- Filter aktif tampil sebagai **chip** yang bisa dihapus satu per satu; tombol
  **Reset Filter** mengembalikan ke awal.
- State filter tersimpan di URL — tautan dapat dibagikan.
- Urutkan via header tabel (Nama, Harga, Status) atau dropdown **Urut**.
- Paginasi 25 / 50 / 100 baris (default 50).

## Mengelola akun admin

Buka **Akun Admin** di sidebar.

- **Tambah Admin** — buat akun baru (nama, email, password sementara min. 8
  karakter). Akun baru berperan **Admin**.
- **Aktifkan / Nonaktifkan** — admin nonaktif tidak dapat login.
- **Reset Password** — tetapkan password baru untuk admin.

Akun superadmin utama tidak dapat dinonaktifkan.

## Audit log

Buka **Audit Log** untuk melihat riwayat: login, pembuatan/perubahan/penghapusan
properti, serta perubahan akun. Setiap entri menampilkan pelaku, waktu (WIB),
dan—untuk perubahan—daftar field beserta nilai sebelum → sesudah.

## Keluar

Klik **Keluar** di kartu profil (bawah sidebar). Sesi dihapus dan Anda
diarahkan kembali ke halaman login.
