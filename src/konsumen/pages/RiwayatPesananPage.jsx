import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import StatusBadge from '../../admin/components/StatusBadge'
import { useAuth } from '../../shared/auth/AuthContext'
import { rupiah } from '../../shared/utils/format'
import { displayStatus, getOrders } from '../../shared/services/orderService'

const tanggal = (ms) =>
  new Date(ms).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

export default function RiwayatPesananPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const newOrderId = location.state?.newOrderId // diisi setelah pembayaran berhasil

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    getOrders(user)
      .then((list) => alive && setOrders(list))
      .catch(() => alive && setError('Riwayat pesanan gagal dimuat. Coba muat ulang halaman.'))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [user])

  // Lanjutkan pembayaran untuk pesanan yang masih menunggu
  const bayar = (order) => {
    sessionStorage.setItem('matcha_order', JSON.stringify(order))
    navigate('/konsumen/pembayaran')
  }

  if (loading) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center text-sm text-stone-500">
        <span className="spinner-border spinner-border-sm mr-2" role="status" />
        Memuat riwayat pesanan...
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center text-sm text-red-600">{error}</div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-matcha-100 text-2xl text-matcha-700">
          <i className="bi bi-clock-history" />
        </div>
        <h2 className="mt-3 text-base font-bold text-matcha-900">Belum ada pesanan</h2>
        <p className="mt-1 text-sm text-stone-500">
          {user
            ? 'Pesanan yang kamu buat akan muncul di sini.'
            : 'Masuk ke akunmu untuk melihat riwayat pesanan.'}
        </p>
        <Link to={user ? '/konsumen/katalog' : '/login'} state={user ? undefined : { from: location }} className="btn-matcha mt-4 no-underline">
          {user ? 'Pilih Menu' : 'Masuk'}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      {!user && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-matcha-200 bg-matcha-50 px-4 py-3 text-xs text-stone-600">
          <span>
            <i className="bi bi-info-circle mr-1.5 text-matcha-700" />
            Kamu belum masuk, jadi riwayat pesanan belum bisa ditampilkan.
          </span>
          <span>
            <Link to="/login" state={{ from: location }} className="font-semibold text-matcha-700">Masuk</Link>
            {' '}atau{' '}
            <Link to="/daftar" state={{ from: location }} className="font-semibold text-matcha-700">daftar</Link>
            {' '}untuk menyimpan pesanan di akunmu.
          </span>
        </div>
      )}

      {newOrderId && (
        <div className="animate-pop-in flex items-center gap-3 rounded-2xl bg-matcha-700 px-4 py-3 text-sm text-white" role="status">
          <i className="bi bi-check-circle-fill text-lg" />
          <span>
            Pembayaran pesanan <b>#{newOrderId}</b> berhasil. Terima kasih!
          </span>
        </div>
      )}

      {orders.map((o) => {
        const status = displayStatus(o)
        const items = o.items || []
        const baru = o.id === newOrderId
        return (
          <div
            key={o.id}
            className={`card-soft p-5 ${baru ? 'ring-2 ring-matcha-500' : ''}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-matcha-900">Pesanan #{o.id}</div>
                <div className="text-xs text-stone-500">{tanggal(o.createdAt)}</div>
              </div>
              <StatusBadge status={status} />
            </div>

            <ul className="mt-3 divide-y divide-matcha-100/70 text-sm">
              {items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3 py-2">
                  <div>
                    <div className="font-semibold text-matcha-900">{i.name}</div>
                    <div className="text-xs text-stone-500">
                      {i.size} · gula {i.sweet} · {i.qty}x
                      {i.note ? ` · "${i.note}"` : ''}
                    </div>
                  </div>
                  <div className="shrink-0 font-semibold text-stone-700">
                    {rupiah(i.unitPrice * i.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-2 grid gap-4 border-t border-matcha-100 pt-3 text-sm sm:grid-cols-2">
              <div className="text-xs text-stone-500">
                <div className="font-semibold text-stone-600">
                  {o.type === 'ambil' ? 'Ambil sendiri' : 'Diantar'}
                </div>
                <div className="mt-0.5">
                  {o.type === 'ambil' ? `${o.address} · ${o.pickup || ''}` : o.address}
                </div>
              </div>
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-stone-500">Subtotal</dt>
                  <dd>{rupiah(o.subtotal)}</dd>
                </div>
                {o.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Diskon member</dt>
                    <dd className="text-matcha-700">- {rupiah(o.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-stone-500">Ongkir</dt>
                  <dd>{o.shipping ? rupiah(o.shipping) : 'Gratis'}</dd>
                </div>
                <div className="flex justify-between border-t border-matcha-100 pt-1 font-bold text-matcha-900">
                  <dt>Total</dt>
                  <dd className="text-matcha-700">{rupiah(o.total)}</dd>
                </div>
              </dl>
            </div>

            {status === 'Menunggu Pembayaran' && (
              <button onClick={() => bayar(o)} className="btn-matcha mt-3 w-full sm:w-auto">
                <i className="bi bi-qr-code" /> Bayar Sekarang
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
