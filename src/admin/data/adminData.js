// Semua data di file ini adalah contoh. Ganti dengan hasil API saat backend siap.

export const kategoriProduk = ['Matcha', 'Signature', 'Dessert']

export const produkAwal = [
  { id: 1, name: 'Iced Matcha Latte', kategori: 'Matcha', harga: 35000, varian: 'S / M / L', stok: 128, status: 'Aktif' },
  { id: 2, name: 'Iced Chocolate Matcha', kategori: 'Matcha', harga: 40000, varian: 'S / M / L', stok: 94, status: 'Aktif' },
  { id: 3, name: 'Matcha Latte', kategori: 'Matcha', harga: 32000, varian: 'S / M', stok: 61, status: 'Menipis' },
  { id: 4, name: 'Matcha Strawberry', kategori: 'Signature', harga: 38000, varian: 'M / L', stok: 0, status: 'Habis' },
  { id: 5, name: 'Iced Matcha Milk', kategori: 'Dessert', harga: 36000, varian: 'S / M / L', stok: 54, status: 'Aktif' },
]

export const pesananAwal = [
  { id: '#MB-1024', pembeli: 'Nadia Putri', jenis: 'Antar', waktu: '09:25', item: 2, total: 168000, pembayaran: 'Dibayar', status: 'Dikirim' },
  { id: '#MB-1023', pembeli: 'Rizky A.', jenis: 'Ambil', waktu: '09:18', item: 1, total: 43000, pembayaran: 'Dibayar', status: 'Diproses' },
  { id: '#MB-1022', pembeli: 'Dewi Larasati', jenis: 'Ambil', waktu: '09:05', item: 1, total: 40000, pembayaran: 'Menunggu', status: 'Menunggu' },
  { id: '#MB-1021', pembeli: 'Bima Prasetya', jenis: 'Antar', waktu: '08:50', item: 4, total: 168000, pembayaran: 'Dibayar', status: 'Diproses' },
  { id: '#MB-1020', pembeli: 'Salsa R.', jenis: 'Ambil', waktu: '08:30', item: 2, total: 80000, pembayaran: 'Dibayar', status: 'Selesai' },
]

// 'Dikirim' hanya untuk pesanan Antar, 'Siap Diambil' hanya untuk pesanan Ambil
export const statusPesanan = ['Menunggu', 'Diproses', 'Dikirim', 'Siap Diambil', 'Selesai']

export const stokAwal = [
  { id: 1, nama: 'Cup 16 oz', stok: 48, min: 100, satuan: 'pcs', status: 'Menipis', update: 'Hari ini, 08:10' },
  { id: 2, nama: 'Cup 12 oz', stok: 40, min: 80, satuan: 'pcs', status: 'Menipis', update: 'Hari ini, 08:10' },
  { id: 3, nama: 'Sedotan', stok: 350, min: 200, satuan: 'pcs', status: 'Aman', update: 'Kemarin, 18:30' },
  { id: 4, nama: 'Susu segar', stok: 6, min: 10, satuan: 'liter', status: 'Menipis', update: 'Hari ini, 07:45' },
  { id: 5, nama: 'Bubuk matcha', stok: 4, min: 2, satuan: 'kg', status: 'Aman', update: 'Kemarin, 16:00' },
]

export const penjualanPerJam = [
  { jam: '08', nilai: 120000 },
  { jam: '09', nilai: 210000 },
  { jam: '10', nilai: 180000 },
  { jam: '11', nilai: 390000 },
  { jam: '12', nilai: 340000 },
  { jam: '13', nilai: 150000 },
  { jam: '14', nilai: 280000 },
  { jam: '15', nilai: 200000 },
  { jam: '16', nilai: 360000 },
  { jam: '17', nilai: 220000 },
]

export const penjualanHarian = {
  omzet: 2450000,
  transaksi: 68,
  menuTerjual: 91,
}

export const trenMingguan = [
  { label: 'Minggu 1', nilai: 11200000 },
  { label: 'Minggu 2', nilai: 13400000 },
  { label: 'Minggu 3', nilai: 13100000 },
  { label: 'Minggu 4', nilai: 20750000 },
]

export const pengeluaranAwal = [
  { id: 1, tanggal: '01 Nov', ket: 'Bubuk matcha 2 kg', kategori: 'Bahan baku', nominal: 1900000 },
  { id: 2, tanggal: '01 Nov', ket: 'Cup dan sedotan', kategori: 'Operasional', nominal: 650000 },
  { id: 3, tanggal: '31 Okt', ket: 'Listrik outlet', kategori: 'Operasional', nominal: 800000 },
  { id: 4, tanggal: '30 Okt', ket: 'Susu dan gula', kategori: 'Bahan baku', nominal: 1250000 },
  { id: 5, tanggal: '30 Okt', ket: 'Biaya pengiriman bahan', kategori: 'Logistik', nominal: 380000 },
]

export const kategoriPengeluaran = ['Bahan baku', 'Operasional', 'Logistik', 'Gaji', 'Lainnya']

export const bulanan = {
  periode: 'November 2026',
  omzet: 58450000,
  transaksi: 1624,
  menuTerjual: 1780,
  hpp: 21200000,
  biayaOperasional: 12350000,
  jumlahPengeluaran: 46,
  budgetTerpakai: 72,
}

export const produkTerlaris = [
  { nama: 'Iced Matcha Latte', cup: 428 },
  { nama: 'Iced Chocolate Matcha', cup: 316 },
  { nama: 'Matcha Latte', cup: 284 },
  { nama: 'Iced Matcha Milk', cup: 205 },
  { nama: 'Matcha Strawberry', cup: 143 },
]
