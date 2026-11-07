// Semua data di file ini adalah contoh. Ganti dengan hasil API saat backend siap.

export const kategoriProduk = ["Matcha", "Signature", "Dessert"];

export const produkAwal = [
  {
    id: 1,
    name: "Iced Matcha Latte",
    kategori: "Matcha",
    harga: 35000,
    varian: "S / M / L",
    stok: 128,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Iced Chocolate Matcha",
    kategori: "Matcha",
    harga: 40000,
    varian: "S / M / L",
    stok: 94,
    status: "Aktif",
  },
  {
    id: 3,
    name: "Matcha Latte",
    kategori: "Matcha",
    harga: 32000,
    varian: "S / M",
    stok: 61,
    status: "Menipis",
  },
  {
    id: 4,
    name: "Matcha Strawberry",
    kategori: "Signature",
    harga: 38000,
    varian: "M / L",
    stok: 0,
    status: "Habis",
  },
  {
    id: 5,
    name: "Iced Matcha Milk",
    kategori: "Dessert",
    harga: 36000,
    varian: "S / M / L",
    stok: 54,
    status: "Aktif",
  },
];

export const pesananAwal = [
  // [BARU] tambah field `metode`: 'QRIS' | 'Transfer/VA' | 'Tunai'
  {
    id: "#MB-1024",
    pembeli: "Nadia Putri",
    jenis: "Antar",
    waktu: "09:25",
    item: 2,
    total: 168000,
    metode: "QRIS",
    pembayaran: "Dibayar",
    status: "Dikirim",
  },
  {
    id: "#MB-1023",
    pembeli: "Rizky A.",
    jenis: "Ambil",
    waktu: "09:18",
    item: 1,
    total: 43000,
    metode: "Transfer/VA",
    pembayaran: "Dibayar",
    status: "Menunggu",
  },
  {
    id: "#MB-1022",
    pembeli: "Dewi Larasati",
    jenis: "Ambil",
    waktu: "09:05",
    item: 1,
    total: 40000,
    metode: "Tunai",
    pembayaran: "Menunggu",
    status: "Menunggu",
  },
  {
    id: "#MB-1021",
    pembeli: "Bima Prasetya",
    jenis: "Antar",
    waktu: "08:50",
    item: 4,
    total: 168000,
    metode: "QRIS",
    pembayaran: "Dibayar",
    status: "Diproses",
  },
  {
    id: "#MB-1020",
    pembeli: "Salsa R.",
    jenis: "Ambil",
    waktu: "08:30",
    item: 2,
    total: 80000,
    metode: "Tunai",
    pembayaran: "Dibayar",
    status: "Selesai",
  },
];

// 'Dikirim' hanya untuk pesanan Antar, 'Siap Diambil' hanya untuk pesanan Ambil
export const statusPesanan = [
  "Menunggu",
  "Diproses",
  "Dikirim",
  "Siap Diambil",
  "Selesai",
];

// [BARU] Alur status per jenis pesanan.
// Antar : Menunggu -> Diproses (sedang diproses) -> Dikirim (sedang diantar) -> Selesai
// Ambil : tanpa tahapan, pesanan masuk (Menunggu) -> langsung Selesai
export const alurStatus = (jenis) =>
  jenis === "Ambil"
    ? ["Menunggu", "Selesai"]
    : ["Menunggu", "Diproses", "Dikirim", "Selesai"];

// [BARU] Pesanan yang sudah diselesaikan admin HARI INI, ikut dihitung ke penjualan harian.
// Sementara disimpan di browser. TODO API: hitung dari GET /penjualan/harian (backend).
const KEY_SELESAI = "matcha_selesai_hari_ini";
const hariIni = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

export function getSelesaiHariIni() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY_SELESAI));
    return d && d.tanggal === hariIni() && Array.isArray(d.list) ? d.list : [];
  } catch {
    return [];
  }
}

export function tambahSelesaiHariIni(p) {
  const list = getSelesaiHariIni();
  if (list.some((x) => x.id === p.id)) return list;
  const next = [
    ...list,
    { id: p.id, total: p.total, item: p.item, waktu: Date.now() },
  ];
  try {
    localStorage.setItem(
      KEY_SELESAI,
      JSON.stringify({ tanggal: hariIni(), list: next }),
    );
  } catch {
    /* penyimpanan penuh / diblokir: abaikan */
  }
  return next;
}

export const stokAwal = [
  {
    id: 1,
    nama: "Cup 16 oz",
    stok: 48,
    min: 100,
    satuan: "pcs",
    status: "Menipis",
    update: "Hari ini, 08:10",
  },
  {
    id: 2,
    nama: "Cup 12 oz",
    stok: 40,
    min: 80,
    satuan: "pcs",
    status: "Menipis",
    update: "Hari ini, 08:10",
  },
  {
    id: 3,
    nama: "Sedotan",
    stok: 350,
    min: 200,
    satuan: "pcs",
    status: "Aman",
    update: "Kemarin, 18:30",
  },
  {
    id: 4,
    nama: "Susu segar",
    stok: 6,
    min: 10,
    satuan: "liter",
    status: "Menipis",
    update: "Hari ini, 07:45",
  },
  {
    id: 5,
    nama: "Bubuk matcha",
    stok: 4,
    min: 2,
    satuan: "kg",
    status: "Aman",
    update: "Kemarin, 16:00",
  },
];

export const penjualanPerJam = [
  { jam: "08", nilai: 120000 },
  { jam: "09", nilai: 210000 },
  { jam: "10", nilai: 180000 },
  { jam: "11", nilai: 390000 },
  { jam: "12", nilai: 340000 },
  { jam: "13", nilai: 150000 },
  { jam: "14", nilai: 280000 },
  { jam: "15", nilai: 200000 },
  { jam: "16", nilai: 360000 },
  { jam: "17", nilai: 220000 },
];

export const penjualanHarian = {
  omzet: 2450000,
  transaksi: 68,
  menuTerjual: 91,
};

export const trenMingguan = [
  { label: "Minggu 1", nilai: 11200000 },
  { label: "Minggu 2", nilai: 13400000 },
  { label: "Minggu 3", nilai: 13100000 },
  { label: "Minggu 4", nilai: 20750000 },
];

export const pengeluaranAwal = [
  {
    id: 1,
    tanggal: "01 Nov",
    ket: "Bubuk matcha 2 kg",
    kategori: "Bahan baku",
    nominal: 1900000,
  },
  {
    id: 2,
    tanggal: "01 Nov",
    ket: "Cup dan sedotan",
    kategori: "Operasional",
    nominal: 650000,
  },
  {
    id: 3,
    tanggal: "31 Okt",
    ket: "Listrik outlet",
    kategori: "Operasional",
    nominal: 800000,
  },
  {
    id: 4,
    tanggal: "30 Okt",
    ket: "Susu dan gula",
    kategori: "Bahan baku",
    nominal: 1250000,
  },
  {
    id: 5,
    tanggal: "30 Okt",
    ket: "Biaya pengiriman bahan",
    kategori: "Logistik",
    nominal: 380000,
  },
];

export const kategoriPengeluaran = [
  "Bahan baku",
  "Operasional",
  "Logistik",
  "Gaji",
  "Lainnya",
];

export const bulanan = {
  periode: "November 2026",
  omzet: 58450000,
  transaksi: 1624,
  menuTerjual: 1780,
  hpp: 21200000,
  biayaOperasional: 12350000,
  jumlahPengeluaran: 46,
  budgetTerpakai: 72,
};

export const produkTerlaris = [
  { nama: "Iced Matcha Latte", cup: 428 },
  { nama: "Iced Chocolate Matcha", cup: 316 },
  { nama: "Matcha Latte", cup: 284 },
  { nama: "Iced Matcha Milk", cup: 205 },
  { nama: "Matcha Strawberry", cup: 143 },
];

// [PERIODE] Data laporan per periode (contoh). TODO API: GET /laporan?periode=harian|mingguan|bulanan
export const opsiPeriode = [
  { key: "harian", label: "Harian" },
  { key: "mingguan", label: "Mingguan" },
  { key: "bulanan", label: "Bulanan" },
];

export const laporanPeriode = {
  harian: {
    nama: "Harian",
    omzet: penjualanHarian.omzet,
    transaksi: penjualanHarian.transaksi,
    menuTerjual: penjualanHarian.menuTerjual,
    hpp: 890000,
    biayaOperasional: 515000,
    bagiRata: "transaksi", // rata-rata per transaksi
    trenJudul: "Tren omzet per jam",
    trenDesc: "Perbandingan omzet tiap jam hari ini.",
    tren: penjualanPerJam.map((j) => ({
      label: `${j.jam}:00`,
      nilai: j.nilai,
    })),
    terlaris: [
      { nama: "Iced Matcha Latte", cup: 25 },
      { nama: "Iced Chocolate Matcha", cup: 19 },
      { nama: "Matcha Latte", cup: 17 },
      { nama: "Iced Matcha Milk", cup: 12 },
      { nama: "Matcha Strawberry", cup: 9 },
    ],
  },
  mingguan: {
    nama: "Mingguan",
    omzet: 20750000,
    transaksi: 576,
    menuTerjual: 632,
    hpp: 7527000,
    biayaOperasional: 4384000,
    bagiRata: 7,
    trenJudul: "Tren omzet per hari",
    trenDesc: "Perbandingan omzet tiap hari dalam minggu ini.",
    tren: [
      { label: "Sen", nilai: 2400000 },
      { label: "Sel", nilai: 2600000 },
      { label: "Rab", nilai: 2700000 },
      { label: "Kam", nilai: 2900000 },
      { label: "Jum", nilai: 3400000 },
      { label: "Sab", nilai: 3900000 },
      { label: "Min", nilai: 2850000 },
    ],
    terlaris: [
      { nama: "Iced Matcha Latte", cup: 152 },
      { nama: "Iced Chocolate Matcha", cup: 112 },
      { nama: "Matcha Latte", cup: 100 },
      { nama: "Iced Matcha Milk", cup: 73 },
      { nama: "Matcha Strawberry", cup: 51 },
    ],
  },
  bulanan: {
    nama: "Bulanan",
    omzet: bulanan.omzet,
    transaksi: bulanan.transaksi,
    menuTerjual: bulanan.menuTerjual,
    hpp: bulanan.hpp,
    biayaOperasional: bulanan.biayaOperasional,
    bagiRata: 30,
    trenJudul: "Tren omzet per minggu",
    trenDesc: "Perbandingan omzet tiap minggu dalam periode ini.",
    tren: trenMingguan,
    terlaris: produkTerlaris,
  },
};

/** Keterangan rentang tanggal untuk tiap periode. */
export function rentangPeriode(key, now = new Date()) {
  const fmt = (d, o) => d.toLocaleDateString("id-ID", o);
  if (key === "harian")
    return fmt(now, { day: "2-digit", month: "long", year: "numeric" });
  if (key === "mingguan") {
    const sen = new Date(now);
    sen.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const min = new Date(sen);
    min.setDate(sen.getDate() + 6);
    return `${fmt(sen, { day: "2-digit", month: "short" })} – ${fmt(min, { day: "2-digit", month: "short", year: "numeric" })}`;
  }
  return bulanan.periode;
}
