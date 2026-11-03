import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, OpenRoute, ProtectedRoute } from './shared/auth/ProtectedRoute'

// Publik & auth
import LandingPage from './konsumen/pages/LandingPage'
import LoginPage from './auth/pages/LoginPage'
import RegisterPage from './auth/pages/RegisterPage'

// Konsumen
import KonsumenLayout from './konsumen/layouts/KonsumenLayout'
import BerandaPage from './konsumen/pages/BerandaPage'
import KatalogPage from './konsumen/pages/KatalogPage'
import KeranjangPage from './konsumen/pages/KeranjangPage'
import CheckoutPage from './konsumen/pages/CheckoutPage'
import PembayaranPage from './konsumen/pages/PembayaranPage'
import RiwayatPesananPage from './konsumen/pages/RiwayatPesananPage'

// Admin
import AdminLayout from './admin/layouts/AdminLayout'
import DashboardPage from './admin/pages/DashboardPage'
import ProdukPage from './admin/pages/ProdukPage'
import StokPage from './admin/pages/StokPage'
import PesananPage from './admin/pages/PesananPage'
import PenjualanHarianPage from './admin/pages/PenjualanHarianPage'
import PengeluaranPage from './admin/pages/PengeluaranPage'
import LaporanPenjualanPage from './admin/pages/LaporanPenjualanPage'
import ProdukTerlarisPage from './admin/pages/ProdukTerlarisPage'
import LaporanLabaPage from './admin/pages/LaporanLabaPage'

export default function App() {
  return (
    <Routes>
      {/* Publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/daftar" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Konsumen: boleh dibuka tanpa login (tamu). Login memberi diskon + riwayat pesanan. */}
      <Route
        path="/konsumen"
        element={
          <OpenRoute>
            <KonsumenLayout />
          </OpenRoute>
        }
      >
        <Route index element={<BerandaPage />} />
        <Route path="katalog" element={<KatalogPage />} />
        <Route path="keranjang" element={<KeranjangPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pembayaran" element={<PembayaranPage />} />
        {/* Riwayat pesanan: tamu (tersimpan di perangkat) maupun konsumen login (tersimpan di akun) */}
        <Route path="riwayat" element={<RiwayatPesananPage />} />
      </Route>

      {/* Role: admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="produk" element={<ProdukPage />} />
        <Route path="stok" element={<StokPage />} />
        <Route path="pesanan" element={<PesananPage />} />
        <Route path="penjualan" element={<PenjualanHarianPage />} />
        <Route path="pengeluaran" element={<PengeluaranPage />} />
        <Route path="laporan" element={<Navigate to="/admin/laporan/penjualan" replace />} />
        <Route path="laporan/penjualan" element={<LaporanPenjualanPage />} />
        <Route path="laporan/produk-terlaris" element={<ProdukTerlarisPage />} />
        <Route path="laporan/laba" element={<LaporanLabaPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
