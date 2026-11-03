import Section from '../components/Section'
import StatCard from '../components/StatCard'
import { bulanan, produkTerlaris } from '../data/adminData'

export default function ProdukTerlarisPage() {
  const maks = produkTerlaris[0].cup
  const top3 = produkTerlaris.slice(0, 3).reduce((s, p) => s + p.cup, 0)
  const kontribusi = ((top3 / bulanan.menuTerjual) * 100).toFixed(1).replace('.', ',')

  return (
    <div className="w-full">
      <div className="card-soft p-5">
        <Section
          title="Produk Terlaris"
          desc="Identifikasi menu berdasarkan volume penjualan pada periode yang dipilih."
        />
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-stone-600">
          <span className="rounded-lg border border-matcha-200 bg-white px-3 py-1.5">Periode: Bulan Ini</span>
          <span className="rounded-lg border border-matcha-200 bg-white px-3 py-1.5">Outlet: Telang</span>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <StatCard label="Menu teratas" value={produkTerlaris[0].nama} note={`${produkTerlaris[0].cup} cup`} icon="bi-trophy" />
          </div>
          <div className="col-12 col-md-4">
            <StatCard label="Total cup terjual" value={bulanan.menuTerjual.toLocaleString('id-ID')} note="+8,5%" icon="bi-cup-straw" />
          </div>
          <div className="col-12 col-md-4">
            <StatCard label="Kontribusi top 3" value={`${kontribusi}%`} icon="bi-pie-chart" />
          </div>
        </div>
      </div>

      <div className="card-soft mt-4 p-5">
        <Section title="Peringkat menu berdasarkan volume penjualan" />
        <ol className="m-0 list-none space-y-4 p-0">
          {produkTerlaris.map((p, i) => (
            <li key={p.nama} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i === 0 ? 'bg-matcha-700 text-white' : 'bg-matcha-100 text-matcha-700'
                }`}
              >
                {i + 1}
              </span>
              <span className="w-40 shrink-0 truncate text-sm font-semibold text-matcha-900 sm:w-52">{p.nama}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-matcha-100">
                <div
                  className={`h-full rounded-full ${i === 0 ? 'bg-matcha-700' : 'bg-matcha-400'}`}
                  style={{ width: `${(p.cup / maks) * 100}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-sm font-semibold text-stone-600">{p.cup} cup</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
