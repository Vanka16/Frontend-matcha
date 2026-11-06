import { useEffect, useMemo, useState } from 'react'
import Section from '../components/Section'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../../shared/auth/AuthContext'
import { getOrders, updateOrderStatus } from '../../shared/services/orderService'
import { rupiah } from '../../shared/utils/format'

const STATUS_OPTIONS = [
  { value: 'PENDING_PAYMENT', label: 'Menunggu Pembayaran' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
]

const PAYMENT_LABEL = {
  SUCCESS: 'Dibayar',
  PENDING: 'Menunggu',
  FAILED: 'Gagal',
  REFUNDED: 'Refund',
}

const tanggal = (ms) =>
  new Date(ms).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

export default function PesananPage() {
  const { user } = useAuth()
  const [pesanan, setPesanan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Semua status')
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let alive = true
    getOrders(user)
      .then((list) => alive && setPesanan(list))
      .catch((err) => alive && setError(err.response?.data?.message || 'Gagal memuat pesanan.'))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [user])

  const stats = useMemo(
    () => ({
      total: pesanan.length,
      pending: pesanan.filter((p) => p.orderStatus === 'PENDING_PAYMENT').length,
      processing: pesanan.filter((p) => p.orderStatus === 'PROCESSING').length,
      completed: pesanan.filter((p) => p.orderStatus === 'COMPLETED').length,
    }),
    [pesanan],
  )

  const tampil = useMemo(
    () =>
      pesanan.filter(
        (p) =>
          (status === 'Semua status' || p.status === status) &&
          (p.id + p.name).toLowerCase().includes(q.toLowerCase()),
      ),
    [pesanan, status, q],
  )

  const ubahStatus = async (id, nextStatus) => {
    const previous = pesanan
    const label = STATUS_OPTIONS.find((s) => s.value === nextStatus)?.label
    setSaveError('')
    setSaving(true)
    setPesanan((list) =>
      list.map((p) => (p.id === id ? { ...p, orderStatus: nextStatus, status: label } : p)),
    )
    setDetail((d) => (d?.id === id ? { ...d, orderStatus: nextStatus, status: label } : d))
    try {
      await updateOrderStatus(id, nextStatus)
    } catch (err) {
      setPesanan(previous)
      setSaveError(err.response?.data?.message || 'Gagal mengubah status pesanan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard label="Total pesanan" value={stats.total} icon="bi-receipt" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Menunggu bayar" value={stats.pending} note="Perlu tindakan" tone="warn" icon="bi-hourglass-split" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Diproses" value={stats.processing} icon="bi-arrow-repeat" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Selesai" value={stats.completed} note="—" tone="muted" icon="bi-check2-circle" />
        </div>
      </div>

      <div className="card-soft p-5">
        <Section title="Pesanan Masuk" desc="Perbarui status pesanan agar pembeli mendapat informasi terbaru." />

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <select className="form-select form-select-sm !w-auto !rounded-lg" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Semua status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value}>{s.label}</option>
            ))}
          </select>
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

        {loading && (
          <p className="py-8 text-center text-sm text-stone-500">
            <span className="spinner-border spinner-border-sm mr-2" role="status" />
            Memuat pesanan dari server...
          </p>
        )}

        {!loading && error && <p className="py-8 text-center text-sm text-red-600">{error}</p>}

        {!loading && !error && (
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
                    <td className="font-semibold text-matcha-900">{p.id.slice(0, 8)}</td>
                    <td>{p.name}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-matcha-800">
                        <i className={`bi ${p.type === 'ambil' ? 'bi-bag-check' : 'bi-bicycle'}`} />
                        {p.type === 'ambil' ? 'Ambil sendiri' : 'Diantar'}
                      </span>
                    </td>
                    <td className="text-xs">{tanggal(p.createdAt)}</td>
                    <td>{p.items.reduce((sum, i) => sum + i.qty, 0)} menu</td>
                    <td>{rupiah(p.total)}</td>
                    <td>
                      <StatusBadge status={PAYMENT_LABEL[p.paymentStatus] || 'Menunggu'} />
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
        )}
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
                  <div className="flex justify-between"><dt className="text-stone-500">Pembeli</dt><dd>{detail.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Telepon</dt><dd>{detail.phone}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Jenis</dt><dd>{detail.type === 'ambil' ? 'Ambil sendiri' : 'Diantar'}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Waktu</dt><dd>{tanggal(detail.createdAt)}</dd></div>
                  <div className="flex justify-between"><dt className="text-stone-500">Alamat / Catatan</dt><dd className="text-right">{detail.address}</dd></div>
                </dl>

                <div className="mb-4 rounded-xl bg-matcha-50 p-3">
                  <div className="mb-1 text-xs font-semibold text-stone-500">Item pesanan</div>
                  {detail.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>
                        {item.name}
                        {item.size ? ` · ${item.size}` : ''} · {item.qty}x
                      </span>
                      <span className="font-semibold">{rupiah(item.unitPrice * item.qty)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-matcha-200 pt-2 text-sm font-bold">
                    <span>Total</span>
                    <span className="text-matcha-700">{rupiah(detail.total)}</span>
                  </div>
                </div>

                <label className="label-matcha !text-xs">Ubah status</label>
                <select
                  className="input-matcha"
                  value={detail.orderStatus}
                  disabled={saving}
                  onChange={(e) => ubahStatus(detail.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {saveError && <p className="mt-2 text-xs text-red-600">{saveError}</p>}
                {saving && <p className="mt-2 text-xs text-stone-500">Menyimpan status...</p>}
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
