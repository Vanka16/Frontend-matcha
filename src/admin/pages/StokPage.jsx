import { useState } from 'react'
import Section from '../components/Section'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { stokAwal } from '../data/adminData'

export default function StokPage() {
  const [stok, setStok] = useState(stokAwal)
  const [info, setInfo] = useState('')

  const menipis = stok.filter((s) => s.status === 'Menipis').length

  const restok = (id) => {
    // TODO API: POST /stok/{id}/restok
    setStok((list) =>
      list.map((s) =>
        s.id === id ? { ...s, stok: s.min * 2, status: 'Aman', update: 'Baru saja' } : s,
      ),
    )
  }

  const buatPermintaan = () => {
    // TODO API: POST /stok/permintaan-restok
    setInfo(`Permintaan restok untuk ${menipis} item sudah dibuat.`)
    setTimeout(() => setInfo(''), 3500)
  }

  return (
    <div className="w-full">
      {menipis > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <i className="bi bi-exclamation-lg" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-amber-900">Peringatan Stok Menipis</div>
            <div className="text-xs text-amber-800">{menipis} item membutuhkan perhatian. Stok bahan di bawah batas minimum.</div>
          </div>
          <button className="btn-matcha !py-2" onClick={buatPermintaan}>
            Buat Permintaan Restok
          </button>
        </div>
      )}
      {info && (
        <div className="mb-4 rounded-xl bg-matcha-100 px-4 py-2 text-sm font-semibold text-matcha-800" role="status">
          {info}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <StatCard label="Item menipis" value={menipis} note="Perlu restock" tone="warn" icon="bi-exclamation" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard label="Stok aman" value={stok.filter((s) => s.status === 'Aman').length} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard label="Total item aktif" value={stok.length} />
        </div>
      </div>

      <div className="card-soft p-5">
        <Section title="Daftar Persediaan" desc="Stok bahan dan perlengkapan beserta batas minimumnya." />
        <div className="table-responsive">
          <table className="table table-matcha table-hover align-middle">
            <thead>
              <tr>
                <th>Nama persediaan</th>
                <th>Stok saat ini</th>
                <th>Batas minimum</th>
                <th>Status</th>
                <th>Terakhir diperbarui</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stok.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold text-matcha-900">{s.nama}</td>
                  <td>{s.stok} {s.satuan}</td>
                  <td>{s.min} {s.satuan}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td>{s.update}</td>
                  <td>
                    <button className="text-xs font-semibold text-matcha-700 hover:underline" onClick={() => restok(s.id)}>
                      Restok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
