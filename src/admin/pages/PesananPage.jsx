import { useMemo, useState } from 'react'
import Section from '../components/Section'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { pesananAwal, statusPesanan } from '../data/adminData'
import { rupiah } from '../../shared/utils/format'

export default function PesananPage() {
  const [pesanan, setPesanan] = useState(pesananAwal)
  const [status, setStatus] = useState('Semua status')
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)

  const tampil = useMemo(
    () =>
      pesanan.filter(
        (p) =>
          (status === 'Semua status' || p.status === status) &&
          (p.id + p.pembeli).toLowerCase().includes(q.toLowerCase()),
      ),
    [pesanan, status, q],
  )

  const ubahStatus = (id, s) =>
    setPesanan((list) => list.map((p) => (p.id === id ? { ...p, status: s } : p)))

  return (
    <div className="w-full">
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard label="Pesanan hari ini" value={38} note="+12%" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Perlu diproses" value={8} note="Segera" tone="warn" icon="bi-hourglass-split" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Dalam pengiriman" value={12} icon="bi-truck" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Selesai hari ini" value={18} note="—" tone="muted" icon="bi-check2-circle" />
        </div>
      </div>

      <div className="card-soft p-5">
        <Section title="Pesanan Masuk" desc="Perbarui status pesanan agar pembeli mendapat informasi terbaru." />

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <select className="form-select form-select-sm !w-auto !rounded-lg" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Semua status</option>
            {statusPesanan.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="rounded-lg border border-matcha-200 bg-white px-3 py-1.5 text-xs text-stone-600">
            Tanggal: Hari ini
          </span>
          <div className="relative ml-auto">
            <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400" />
            <input
              className="w-52 rounded-lg border border-matcha-200 bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-matcha-500"
              placeholder="Cari pesanan..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-matcha table-hover align-middle">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pembeli</th>
                <th>Jenis</th>
                <th>Waktu</th>
                <th>Item</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold text-matcha-900">{p.id}</td>
                  <td>{p.pembeli}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-matcha-800">
                      <i className={`bi ${p.jenis === 'Ambil' ? 'bi-bag-check' : 'bi-bicycle'}`} />
                      {p.jenis === 'Ambil' ? 'Ambil sendiri' : 'Diantar'}
                    </span>
                  </td>
                  <td>{p.waktu}</td>
                  <td>{p.item} menu</td>
                  <td>{rupiah(p.total)}</td>
                  <td>
                    <StatusBadge status={p.pembayaran} />
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>
                    <button className="text-xs font-semibold text-matcha-700 hover:underline" onClick={() => setDetail(p)}>
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-400">
                    Tidak ada pesanan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="modal d-block" style={{ background: 'rgba(31,61,26,.45)' }} onClick={() => setDetail(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content !rounded-2xl border-0 p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title !text-base !font-bold text-matcha-900">Pesanan {detail.id}</h5>
                <button type="button" className="btn-close" aria-label="Tutup" onClick={() => setDetail(null)} />
              </div>
              <div className="modal-body text-sm">
                <dl className="mb-4 space-y-1.5">
                  <div className="flex justify-between"><dt className="text-stone-500">Pembeli</dt><dd>{detail.pembeli}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Jenis</dt><dd>{detail.jenis === 'Ambil' ? 'Ambil sendiri' : 'Diantar'}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Waktu</dt><dd>{detail.waktu}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Item</dt><dd>{detail.item} menu</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Total</dt><dd className="font-bold">{rupiah(detail.total)}</dd></div>
                </dl>
                <label className="label-matcha !text-xs">Ubah status</label>
                <select
                  className="input-matcha"
                  value={detail.status}
                  onChange={(e) => {
                    ubahStatus(detail.id, e.target.value)
                    setDetail({ ...detail, status: e.target.value })
                  }}
                >
                  {statusPesanan
                    .filter((s) => (detail.jenis === 'Ambil' ? s !== 'Dikirim' : s !== 'Siap Diambil'))
                    .map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn-matcha" onClick={() => setDetail(null)}>
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
