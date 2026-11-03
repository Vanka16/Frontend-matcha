// Data contoh. Nanti ganti dengan hasil dari API (mis. GET /produk).
// Kalau sudah punya foto asli dari Figma, taruh di src/assets lalu isi field `image`.
import { getImage } from '../../shared/utils/assets'

export const menu = [
  { id: 1, name: 'Iced Matcha Latte', price: 35000, tag: 'Best seller', tone: 'latte', image: getImage('iced-matcha-latte') },
  { id: 2, name: 'Iced Chocolate Matcha', price: 40000, tag: 'Favorit', tone: 'choco', image: getImage('iced-chocolate-matcha') },
  { id: 3, name: 'Matcha Latte', price: 32000, tag: 'Klasik', tone: 'latte', image: getImage('matcha-latte') },
  { id: 4, name: 'Iced Matcha Milk', price: 38000, tag: 'Baru', tone: 'milk', image: getImage('iced-matcha-milk') },
]

export const sizes = [
  { key: 'S', label: 'S', add: 0 },
  { key: 'M', label: 'M', add: 3000 },
  { key: 'L', label: 'L', add: 6000 },
]

export const sweetness = ['25%', '50%', '100%']

// ---- Jenis pesanan & ongkir (ubah angka di sini kalau tarifnya berubah) ----
export const ONGKIR_FLAT = 10000 // Rp, tarif tetap (sementara, tanpa hitung jarak)

// ---- Diskon untuk konsumen yang login (0.05 = 5%) ----
export const DISKON_MEMBER = 0.05
export const GERAI = 'Gerai Telang · Surabaya'

export const orderTypes = [
  { key: 'antar', title: 'Diantar', desc: 'Dikirim ke alamatmu', icon: 'bi-bicycle' },
  { key: 'ambil', title: 'Ambil Sendiri', desc: 'Take away di gerai, tanpa ongkir', icon: 'bi-bag-check' },
]

export const pickupOptions = ['Secepatnya (± 15 menit)', '30 menit lagi', '1 jam lagi']

/** Ongkir = tarif x jumlah blok 2 km (dibulatkan ke atas). 1-2 km = 7rb, 3-4 km = 14rb, dst. */
export const hitungOngkir = () => ONGKIR_FLAT
