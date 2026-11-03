import DashboardShell from '../../shared/layouts/DashboardShell'

// Menu sidebar khusus admin
export const adminNav = [
  {
    to: '/admin',
    end: true,
    label: 'Dashboard',
    icon: 'bi-grid',
    title: 'Dashboard',
    subtitle: 'Ringkasan operasional gerai hari ini',
  },
  {
    to: '/admin/produk',
    label: 'Produk & Menu',
    icon: 'bi-box-seam',
    children: [
      {
        to: '/admin/produk',
        label: 'Daftar Produk',
        title: 'Produk & Menu',
        subtitle: 'Kelola katalog, harga, varian, foto, dan stok',
      },
      {
        to: '/admin/stok',
        label: 'Stok & Persediaan',
        title: 'Stok & Persediaan',
        subtitle: 'Pantau ketersediaan bahan agar tidak kehabisan',
      },
    ],
  },
  {
    to: '/admin/pesanan',
    label: 'Pesanan',
    icon: 'bi-receipt',
    title: 'Daftar Pesanan',
    subtitle: 'Perbarui status pesanan agar pembeli mendapat informasi terbaru',
  },
  {
    to: '/admin/penjualan',
    label: 'Penjualan',
    icon: 'bi-graph-up',
    title: 'Penjualan Harian',
    subtitle: 'Catat dan pantau transaksi harian gerai Telang',
  },
  {
    to: '/admin/pengeluaran',
    label: 'Pengeluaran',
    icon: 'bi-wallet2',
    title: 'Pengeluaran Usaha',
    subtitle: 'Catat dan pantau pengeluaran operasional gerai Telang',
  },
  {
    to: '/admin/laporan',
    label: 'Laporan',
    icon: 'bi-file-earmark-bar-graph',
    children: [
      {
        to: '/admin/laporan/penjualan',
        label: 'Laporan Penjualan',
        title: 'Laporan Penjualan',
        subtitle: 'Cek tren omzet bulanan dan perbandingan antar periode',
      },
      {
        to: '/admin/laporan/produk-terlaris',
        label: 'Produk Terlaris',
        title: 'Produk Terlaris',
        subtitle: 'Identifikasi menu terpopuler dan performa penjualan',
      },
      {
        to: '/admin/laporan/laba',
        label: 'Laporan Laba',
        title: 'Laporan Laba',
        subtitle: 'Pantau pendapatan, HPP, dan biaya untuk mengetahui hasil usaha',
      },
    ],
  },
]

export default function AdminLayout() {
  return <DashboardShell nav={adminNav} roleLabel="Pengelola gerai" />
}
