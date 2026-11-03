import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/auth/AuthContext'
import { USE_MOCK } from '../../shared/services/api'
import { getPaymentStatus, simulateMockPayment } from '../../shared/services/paymentService'
import { rupiah } from '../../shared/utils/format'
import { useCart } from '../context/CartContext'
import { updateOrderStatus } from '../services/orderService'

/** QR sementara (placeholder). Ganti dengan gambar QRIS dari API pembayaran. */
function QrPlaceholder({ seed = 7 }) {
  const cells = useMemo(() => {
    const n = 21
    let s = seed
    const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    const inFinder = (x, y) =>
      (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8)
    const list = []
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) if (!inFinder(x, y) && rand() > 0.52) list.push([x, y])
    return list
  }, [seed])

  const finder = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#173a0a" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#173a0a" />
    </g>
  )

  return (
    <svg viewBox="0 0 21 21" className="h-24 w-24" shapeRendering="crispEdges">
      <rect width="21" height="21" fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#173a0a" />
      ))}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  )
}

const steps = [
  'Buka aplikasi e-wallet atau mobile banking Anda.',
  'Pilih menu scan QRIS.',
  'Scan QR di halaman ini dan konfirmasi jumlah pembayaran.',
  'Selesai! Pembayaran terdeteksi otomatis, kamu tidak perlu menekan tombol apa pun.',
]

const POLL_MS = 3000 // cek status pembayaran tiap 3 detik
const EXPIRE_MS = 15 * 60 * 1000 // QR berlaku 15 menit

const mmss = (ms) => {
  const t = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

export default function PembayaranPage() {
  const { clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('pending') // pending | paid | expired | failed
  const [netError, setNetError] = useState(false)
  const [now, setNow] = useState(Date.now())
  const checking = useRef(false)

  const order = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('matcha_order'))
    } catch {
      return null
    }
  }, [])

  const expiresAt = order ? order.createdAt + EXPIRE_MS : 0
  const remaining = expiresAt - now
  const waiting = status === 'pending' && remaining > 0

  // Hitung mundur
  useEffect(() => {
    if (!waiting) return undefined
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [waiting])

  // Cek status ke server secara berkala (polling) sampai lunas / kedaluwarsa
  useEffect(() => {
    if (!order || !waiting) return undefined
    let alive = true

    const check = async () => {
      if (checking.current) return
      checking.current = true
      try {
        const { status: s } = await getPaymentStatus(order.id)
        if (!alive) return
        setNetError(false)
        if (s === 'paid') {
          updateOrderStatus(user, order.id, 'Dibayar')
          clear()
          sessionStorage.removeItem('matcha_order')
          setStatus('paid')
        } else if (s === 'expired' || s === 'failed') {
          setStatus(s)
        }
      } catch {
        if (alive) setNetError(true) // koneksi putus: coba lagi di putaran berikutnya
      } finally {
        checking.current = false
      }
    }

    check()
    const t = setInterval(check, POLL_MS)
    const onVisible = () => document.visibilityState === 'visible' && check()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      clearInterval(t)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [order, waiting, clear, user])

  // Setelah lunas, siapa pun (login atau tamu) otomatis dibawa ke Riwayat Pesanan
  useEffect(() => {
    if (status !== 'paid') return undefined
    const t = setTimeout(
      () => navigate('/konsumen/riwayat', { replace: true, state: { newOrderId: order?.id } }),
      2500,
    )
    return () => clearTimeout(t)
  }, [status, navigate, order])

  if (!order && status !== 'paid') {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center">
        <p className="text-sm text-stone-500">Belum ada pesanan yang perlu dibayar.</p>
        <Link to="/konsumen/katalog" className="btn-matcha mt-4">
          Pilih Menu
        </Link>
      </div>
    )
  }

  if (status === 'paid') {
    return (
      <div className="card-soft mx-auto max-w-lg animate-pop-in p-10 text-center">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-matcha-700 text-white">
          <span className="absolute inset-0 animate-ring rounded-full border-2 border-matcha-500" />
          <i className="bi bi-check-lg text-3xl" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-matcha-900">Pembayaran Diterima!</h2>
        <p className="mt-1 text-sm text-stone-500">
          Terima kasih, pembayaranmu sudah terdeteksi otomatis. Pesanan akan segera diproses.
        </p>
        <p className="mt-3 text-xs text-stone-400">Mengarahkan ke Riwayat Pesanan...</p>
        <Link
          to="/konsumen/riwayat"
          replace
          state={{ newOrderId: order?.id }}
          className="btn-matcha mt-3 no-underline"
        >
          Lihat Riwayat Pesanan
        </Link>
        {!user && (
          <p className="mt-4 text-xs text-stone-500">
            Mau diskon 5% dan riwayat tersimpan di akun?{' '}
            <Link to="/daftar" state={{ from: { pathname: '/konsumen/riwayat' } }} className="font-semibold text-matcha-700">
              Daftar gratis
            </Link>
          </p>
        )}
      </div>
    )
  }

  const dead = status === 'expired' || status === 'failed' || remaining <= 0

  if (dead) {
    return (
      <div className="card-soft mx-auto max-w-lg animate-pop-in p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <i className="bi bi-clock-history text-3xl" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-matcha-900">
          {status === 'failed' ? 'Pembayaran Gagal' : 'Waktu Pembayaran Habis'}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Pesanan #{order.id} belum dibayar. Kalau saldo sudah terpotong, hubungi gerai dengan menyebut nomor pesanan ini.
        </p>
        <Link to="/konsumen/checkout" className="btn-matcha mt-5">
          Buat Pesanan Ulang
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card-soft p-5 sm:p-6">
            <h2 className="text-base font-bold text-matcha-900">Pembayaran Pesanan #{order.id}</h2>
            <p className="text-xs text-stone-500">Pesanan diproses otomatis setelah pembayaran terdeteksi.</p>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-matcha-100 text-matcha-700">
                <span className="absolute inset-0 animate-ring rounded-full border-2 border-matcha-500" />
                <span className="spinner-border spinner-border-sm" role="status" />
              </div>
              <div className="mt-2 text-sm font-bold text-matcha-900">Menunggu Pembayaran</div>
              <div className="text-xs text-stone-500">
                Selesaikan dalam <span className="font-bold text-matcha-700">{mmss(remaining)}</span>. Halaman ini
                akan berubah sendiri begitu pembayaran masuk.
              </div>
            </div>

            <div className="mt-6 grid items-center gap-5 rounded-2xl bg-matcha-50 p-5 sm:grid-cols-2">
              <div>
                <div className="text-xs text-stone-500">Total pembayaran</div>
                <div className="mt-1 text-2xl font-extrabold text-matcha-700">{rupiah(order.total)}</div>
                {order.discount > 0 && (
                  <div className="mt-1 text-xs font-semibold text-matcha-700">
                    Sudah termasuk diskon member {rupiah(order.discount)}
                  </div>
                )}
                <div className="mt-1.5 text-xs text-stone-500">
                  {order.type === 'ambil'
                    ? `Ambil sendiri · ${order.pickup || ''}`
                    : `Diantar · ongkir ${rupiah(order.shipping)}`}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="overflow-hidden rounded-xl border border-matcha-200 bg-white p-1.5">
                  <QrPlaceholder />
                </div>
                <div className="text-xs">
                  <div className="text-stone-500">Metode digital</div>
                  <div className="font-bold text-matcha-900">QRIS</div>
                </div>
              </div>
            </div>

            {netError && (
              <div className="mt-4 animate-pop-in rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status">
                Koneksi bermasalah, sedang mencoba memeriksa status lagi...
              </div>
            )}

            {USE_MOCK && (
              <div className="mt-5 rounded-xl border border-dashed border-matcha-400 p-3 text-center">
                <div className="mb-2 text-[11px] text-stone-500">
                  Mode contoh (tanpa backend). Tombol ini tidak ada di versi asli.
                </div>
                <button
                  type="button"
                  onClick={() => simulateMockPayment(order.id)}
                  className="btn-outline-matcha !py-1.5 text-xs"
                >
                  Simulasikan pembayaran masuk
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card-soft p-5">
            <h3 className="text-sm font-bold text-matcha-900">Instruksi Pembayaran</h3>
            <ol className="mt-3 space-y-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-stone-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-matcha-100 text-xs font-bold text-matcha-700">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
