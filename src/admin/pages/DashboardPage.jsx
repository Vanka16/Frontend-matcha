import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Section from '../components/Section'
import { penjualanHarian, pesananAwal, stokAwal } from '../data/adminData'
import { rupiah } from '../../shared/utils/format'

// Dashboard ringkas: hanya merangkum angka dari halaman-halaman yang ada di desain.
export default function DashboardPage() {
  const perluDiproses = pesananAwal.filter((p) => p.status === 'Menunggu' || p.status === 'Diproses').length
  const stokMenipis = stokAwal.filter((s) => s.status === 'Menipis').length

  const shortcut = [
    { to: '/admin/pesanan', icon: 'bi-receipt', label: 'Lihat pesanan masuk' },
    { to: '/admin/produk', icon: 'bi-box-seam', label: 'Kelola produk & menu' },
    { to: '/admin/stok', icon: 'bi-exclamation-triangle', label: 'Cek stok menipis' },
    { to: '/admin/laporan/laba', icon: 'bi-cash-coin', label: 'Lihat laporan laba' },
  ]

  return (
    <div className="w-full">
      <div className="row g-3">
        <div className="col-6 col-lg-3">
          <StatCard label="Omzet hari ini" value={rupiah(penjualanHarian.omzet)} note="+8,2%" icon="bi-cash" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Transaksi" value={penjualanHarian.transaksi} icon="bi-receipt" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Pesanan perlu diproses" value={perluDiproses} note="Segera" tone="warn" icon="bi-hourglass-split" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Stok menipis" value={stokMenipis} note="Perlu restock" tone="warn" icon="bi-box" />
        </div>
      </div>

      <div className="card-soft mt-4 p-5">
        <Section title="Pintasan" desc="Menuju halaman yang paling sering dipakai." />
        <div className="row g-3">
          {shortcut.map((s) => (
            <div key={s.to} className="col-12 col-sm-6 col-lg-3">
              <Link
                to={s.to}
                className="flex items-center gap-3 rounded-xl border border-matcha-100 bg-matcha-50/60 p-3 text-sm font-semibold text-matcha-900 no-underline transition hover:border-matcha-400 hover:bg-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-matcha-700 text-white">
                  <i className={`bi ${s.icon}`} />
                </span>
                {s.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
