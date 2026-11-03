import Section from '../components/Section'
import StatCard from '../components/StatCard'
import { bulanan } from '../data/adminData'
import { rupiah } from '../../shared/utils/format'

export default function LaporanLabaPage() {
  const { omzet, hpp, biayaOperasional } = bulanan
  const labaKotor = omzet - hpp
  const labaBersih = labaKotor - biayaOperasional
  const persen = (n) => ((n / omzet) * 100).toFixed(1).replace('.', ',') + '%'

  const bagian = [
    { label: 'HPP', nilai: hpp, warna: 'bg-matcha-300', teks: 'text-matcha-900' },
    { label: 'Biaya', nilai: biayaOperasional, warna: 'bg-amber-600', teks: 'text-white' },
    { label: 'Laba bersih', nilai: labaBersih, warna: 'bg-matcha-700', teks: 'text-white' },
  ]

  const rincian = [
    ['Penjualan', rupiah(omzet)],
    ['Diskon / retur', rupiah(0)],
    ['Pendapatan bersih', rupiah(omzet)],
    ['Harga pokok penjualan', `− ${rupiah(hpp)}`],
    ['Laba kotor', rupiah(labaKotor)],
    ['Biaya operasional', `− ${rupiah(biayaOperasional)}`],
  ]

  return (
    <div className="w-full">
      <div className="card-soft p-5">
        <Section
          title="Laba Kotor & Laba Bersih"
          desc="Ringkasan keuntungan outlet Telang berdasarkan pendapatan dan biaya bulan ini."
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
            <StatCard label="Total penjualan" value={rupiah(omzet)} note="+8,5%" icon="bi-cash" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Harga pokok (HPP)" value={rupiah(hpp)} icon="bi-box-seam" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Laba kotor" value={rupiah(labaKotor)} note={persen(labaKotor)} icon="bi-graph-up" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Laba bersih" value={rupiah(labaBersih)} note={persen(labaBersih)} icon="bi-piggy-bank" />
          </div>
        </div>
      </div>

      <div className="row g-4 mt-0">
        <div className="col-12 col-lg-7">
          <div className="card-soft h-100 p-5">
            <Section title="Komposisi pendapatan" />
            <div className="flex h-9 overflow-hidden rounded-lg">
              {bagian.map((b) => (
                <div
                  key={b.label}
                  className={`flex items-center justify-center text-[11px] font-bold ${b.warna} ${b.teks}`}
                  style={{ width: `${(b.nilai / omzet) * 100}%` }}
                >
                  {b.label}
                </div>
              ))}
            </div>
            <ul className="m-0 mt-4 list-none space-y-2 p-0 text-sm">
              {[
                ['Penjualan', omzet, 'bg-stone-300'],
                ['Harga pokok penjualan', hpp, 'bg-matcha-300'],
                ['Biaya operasional', biayaOperasional, 'bg-amber-600'],
                ['Laba bersih', labaBersih, 'bg-matcha-700'],
              ].map(([label, nilai, warna]) => (
                <li key={label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${warna}`} />
                  <span className="flex-1 text-stone-600">{label}</span>
                  <span className="font-semibold text-matcha-900">{rupiah(nilai)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card-soft h-100 p-5">
            <Section title="Rincian perhitungan" />
            <dl className="m-0 space-y-2 text-sm">
              {rincian.map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="font-normal text-stone-500">{k}</dt>
                  <dd className="m-0 font-semibold text-stone-700">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-matcha-100 pt-3">
              <span className="text-sm font-bold text-matcha-900">Laba bersih</span>
              <span className="text-lg font-extrabold text-matcha-700">{rupiah(labaBersih)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
