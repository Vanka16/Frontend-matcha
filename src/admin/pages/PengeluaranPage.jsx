import { useMemo, useState } from 'react'
import Section from '../components/Section'
import StatCard from '../components/StatCard'
import { bulanan, kategoriPengeluaran, pengeluaranAwal } from '../data/adminData'
import { rupiah } from '../../shared/utils/format'

export default function PengeluaranPage() {
  const [daftar, setDaftar] = useState(pengeluaranAwal)
  const [form, setForm] = useState({ ket: '', nominal: '', kategori: 'Bahan baku' })

  // Total bulan ini = data bulanan + pengeluaran baru yang dicatat di halaman ini
  const baru = useMemo(
    () => daftar.filter((d) => d.baru).reduce((s, d) => s + d.nominal, 0),
    [daftar],
  )
  const total = bulanan.biayaOperasional + baru
  const jumlah = bulanan.jumlahPengeluaran + daftar.filter((d) => d.baru).length

  const terbesar = useMemo(() => {
    const per = {}
    daftar.forEach((d) => (per[d.kategori] = (per[d.kategori] || 0) + d.nominal))
    return Object.entries(per).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
  }, [daftar])

  const simpan = (e) => {
    e.preventDefault()
    // TODO API: POST /pengeluaran
    const tgl = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    setDaftar((l) => [
      { id: Date.now(), tanggal: tgl, ket: form.ket, kategori: form.kategori, nominal: Number(form.nominal), baru: true },
      ...l,
    ])
    setForm({ ket: '', nominal: '', kategori: form.kategori })
  }

  return (
    <div className="w-full">
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard label="Pengeluaran bulan ini" value={rupiah(total)} icon="bi-wallet2" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Jumlah transaksi" value={jumlah} icon="bi-receipt" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Kategori terbesar" value={terbesar} icon="bi-tag" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Budget terpakai" value={`${bulanan.budgetTerpakai}%`} note="dari budget" tone="muted" icon="bi-pie-chart" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <form onSubmit={simpan} className="card-soft p-5">
            <h3 className="text-sm font-bold text-matcha-900">Catat Pengeluaran</h3>
            <div className="mt-3">
              <label className="label-matcha !text-xs">Nama pengeluaran</label>
              <input required className="input-matcha" placeholder="Contoh: pembelian bubuk" value={form.ket} onChange={(e) => setForm({ ...form, ket: e.target.value })} />
            </div>
            <div className="mt-3">
              <label className="label-matcha !text-xs">Nominal</label>
              <input required type="number" min="0" className="input-matcha" placeholder="Rp" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} />
            </div>
            <div className="mt-3">
              <label className="label-matcha !text-xs">Kategori</label>
              <select className="input-matcha" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {kategoriPengeluaran.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-matcha mt-4 w-full">
              Simpan Pengeluaran
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card-soft p-5">
            <Section title="Riwayat Pengeluaran" desc="Catatan pengeluaran terbaru gerai Telang." />
            <div className="table-responsive">
              <table className="table table-matcha table-hover align-middle">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Keterangan</th>
                    <th>Kategori</th>
                    <th className="text-end">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {daftar.map((d) => (
                    <tr key={d.id}>
                      <td>{d.tanggal}</td>
                      <td className="font-semibold text-matcha-900">{d.ket}</td>
                      <td>{d.kategori}</td>
                      <td className="text-end">{rupiah(d.nominal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
