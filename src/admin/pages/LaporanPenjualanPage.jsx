import Section from '../components/Section'
import StatCard from '../components/StatCard'
import { bulanan, trenMingguan } from '../data/adminData'
import { rupiah } from '../../shared/utils/format'

export default function LaporanPenjualanPage() {
  const maks = Math.max(...trenMingguan.map((m) => m.nilai))
  const rataHarian = Math.round(bulanan.omzet / 30)

  return (
    <div className="w-full">
      <div className="card-soft p-5">
        <Section
          title="Rekap Penjualan Bulanan"
          desc="Pilih periode untuk melihat ringkasan penjualan."
          action={
            <button className="btn-matcha !py-2" onClick={() => window.print()}>
              Ekspor Laporan
            </button>
          }
        />
        <div className="mb-4 inline-block rounded-lg border border-matcha-200 bg-white px-3 py-1.5 text-xs text-stone-600">
          Periode: {bulanan.periode}
        </div>

        <div className="row g-3">
          <div className="col-6 col-lg-3">
            <StatCard label="Total omzet" value={rupiah(bulanan.omzet)} note="+8,5%" icon="bi-cash" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Total transaksi" value={bulanan.transaksi.toLocaleString('id-ID')} icon="bi-receipt" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Rata-rata harian" value={rupiah(rataHarian)} icon="bi-calendar-day" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Menu terjual" value={`${bulanan.menuTerjual.toLocaleString('id-ID')} cup`} icon="bi-cup-straw" />
          </div>
        </div>
      </div>

      <div className="card-soft mt-4 p-5">
        <Section title="Tren omzet per minggu" desc="Perbandingan omzet tiap minggu dalam periode ini." />
        <div className="flex h-64 items-end justify-around gap-4 px-2 sm:px-10">
          {trenMingguan.map((m) => (
            <div key={m.label} className="flex h-full w-full max-w-[110px] flex-col items-center justify-end">
              <div className="mb-1 text-[11px] font-semibold text-matcha-800">{rupiah(m.nilai)}</div>
              <div
                className={`w-full rounded-t-xl ${m.nilai === maks ? 'bg-matcha-700' : 'bg-matcha-400'}`}
                style={{ height: `${(m.nilai / maks) * 80}%` }}
              />
              <div className="mt-2 text-xs text-stone-500">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
