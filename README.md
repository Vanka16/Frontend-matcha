# Matcha and Me — Frontend

React (Vite) + Tailwind CSS + Bootstrap. Dua role dengan folder terpisah: **admin** dan **konsumen**.

## Menjalankan

```bash
npm install
cp .env.example .env     # lalu sesuaikan
npm run dev
```

Buka http://localhost:5173

Mode contoh (`VITE_USE_MOCK=true`): login tanpa backend. Email yang diawali `admin` (mis. `admin@matcha.id`) masuk sebagai **admin**, email lain masuk sebagai **konsumen**. Password bebas.

## Struktur folder

```
src/
├── admin/                 ← semua yang khusus admin
│   ├── layouts/AdminLayout.jsx     (menu sidebar admin)
│   ├── pages/                      (Dashboard, Produk, Stok, Pesanan, Penjualan, Pengeluaran, Laporan x3)
│   ├── components/                 (StatCard, StatusBadge, Section)
│   └── data/adminData.js           (data contoh)
├── konsumen/              ← semua yang khusus konsumen
│   ├── layouts/KonsumenLayout.jsx  (menu sidebar konsumen)
│   ├── pages/                      (Landing, Beranda, Katalog, Keranjang, Checkout, Pembayaran)
│   ├── components/ProductCard.jsx
│   ├── context/CartContext.jsx
│   └── data/menu.js
├── auth/                  ← halaman Login & Daftar
├── shared/                ← dipakai bersama
│   ├── auth/                       (AuthContext, ProtectedRoute)
│   ├── services/                   (api.js axios, authService.js)
│   ├── layouts/DashboardShell.jsx  (sidebar + topbar)
│   └── components/                 (Logo, DrinkImage)
├── App.jsx                ← semua routing
└── main.jsx
```

## Route

| Path | Role | Halaman |
|---|---|---|
| `/` | publik | Landing |
| `/login`, `/daftar` | tamu | Login, Daftar |
| `/konsumen` | konsumen | Beranda |
| `/konsumen/katalog` `/keranjang` `/checkout` `/pembayaran` | konsumen | — |
| `/admin` | admin | Dashboard |
| `/admin/produk` `/stok` `/pesanan` `/penjualan` `/pengeluaran` | admin | — |
| `/admin/laporan/penjualan` `/produk-terlaris` `/laba` | admin | — |

Admin tidak bisa membuka halaman konsumen (dan sebaliknya) — otomatis dialihkan ke dashboard role-nya.

## Integrasi API

1. Set `VITE_API_URL` dan `VITE_USE_MOCK=false` di `.env`.
2. Login/daftar ada di `src/shared/services/authService.js`. Response yang diharapkan:
   ```json
   { "token": "xxx", "user": { "id": 1, "name": "Nama", "email": "a@b.c", "role": "admin" } }
   ```
   `role` harus `"admin"` atau `"konsumen"`.
3. Token otomatis dikirim sebagai `Authorization: Bearer ...` (lihat `src/shared/services/api.js`).
4. Data halaman masih contoh. Titik yang perlu disambungkan ditandai komentar `TODO API`.

## Mengganti ilustrasi dengan foto asli

Komponen `DrinkImage` menampilkan ilustrasi gelas bila produk belum punya foto. Export foto dari Figma ke `src/assets/`, lalu isi field `image` di `src/konsumen/data/menu.js`:

```js
import latte from '../../assets/iced-matcha-latte.png'
{ id: 1, name: 'Iced Matcha Latte', price: 35000, image: latte, ... }
```

## Pembayaran otomatis (tanpa tombol "Saya sudah bayar")

Halaman Pembayaran memeriksa `GET /pembayaran/:orderId/status` setiap 3 detik dan berubah sendiri saat
statusnya `paid`. Status `paid` **harus** diisi backend dari webhook penyedia pembayaran (Midtrans/Xendit, dll.)
yang tanda tangannya sudah diverifikasi, bukan dari klik pengguna. Di mode contoh (`VITE_USE_MOCK=true`) ada tombol
"Simulasikan pembayaran masuk" supaya alurnya bisa dicoba tanpa backend.
