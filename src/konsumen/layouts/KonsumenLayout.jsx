import DashboardShell from '../../shared/layouts/DashboardShell'

// Menu sidebar khusus konsumen
export const konsumenNav = [
  {
    to: '/konsumen',
    end: true,
    label: 'Beranda',
    icon: 'bi-house',
    title: 'Beranda',
    subtitle: 'Nikmati kesegaran matcha alami',
  },
  {
    to: '/konsumen/katalog',
    label: 'Katalog Menu',
    icon: 'bi-cup-straw',
    title: 'Katalog Menu',
    subtitle: 'Pilih minuman favorit dan sesuaikan dengan selera Anda',
  },
  {
    to: '/konsumen/keranjang',
    label: 'Keranjang',
    icon: 'bi-bag',
    title: 'Keranjang Belanja',
    subtitle: 'Periksa pilihan menu sebelum melanjutkan pembayaran',
  },
  {
    to: '/konsumen/checkout',
    label: 'Checkout',
    icon: 'bi-credit-card',
    title: 'Checkout',
    subtitle: 'Pilih diantar atau ambil sendiri',
  },
  {
    to: '/konsumen/pembayaran',
    label: 'Pembayaran',
    icon: 'bi-qr-code',
    title: 'Pembayaran',
    subtitle: 'Selesaikan transaksi dengan metode pembayaran pilihan',
  },
  {
    to: '/konsumen/riwayat',
    label: 'Riwayat Pesanan',
    icon: 'bi-clock-history',
    title: 'Riwayat Pesanan',
    subtitle: 'Pantau semua pesanan yang pernah kamu buat',
  },
]

export default function KonsumenLayout() {
  return <DashboardShell nav={konsumenNav} roleLabel="Konsumen" />
}
