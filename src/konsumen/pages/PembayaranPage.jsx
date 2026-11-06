import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPaymentToken, getPaymentStatus } from '../../shared/services/paymentService'
import { rupiah } from '../../shared/utils/format'

const steps = [
  'Klik tombol "Buka Pembayaran Midtrans".',
  'Pilih QRIS atau e-wallet di halaman pembayaran.',
  'Selesaikan pembayaran sesuai nominal yang tertera.',
  'Status pesanan diperbarui otomatis setelah pembayaran terverifikasi.',
]

const POLL_MS = 3000 // cek status pembayaran tiap 3 detik
const EXPIRE_MS = 15 * 60 * 1000 // QR berlaku 15 menit

const mmss = (ms) => {
  const t = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

const readOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem('matcha_order'))
  } catch {
    return null
  }
}

export default function PembayaranPage() {
  const navigate = useNavigate()
  const [order] = useState(readOrder)
  const [status, setStatus] = useState('pending') // pending | paid | expired | failed
  const [netError, setNetError] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [paymentLink, setPaymentLink] = useState('')
  const [preparingPayment, setPreparingPayment] = useState(false)
  const [payError, setPayError] = useState('')
  const checking = useRef(false)
  const tokenRequested = useRef(false)

  const expiresAt = order ? order.createdAt + EXPIRE_MS : 0
  const remaining = expiresAt - now
  const waiting = status === 'pending' && remaining > 0

  // Minta token Midtrans sekali saat halaman dibuka (atau saat tombol coba lagi ditekan).
  const preparePayment = async () => {
    if (!order || preparingPayment) return
    setPreparingPayment(true)
    setPayError('')
    try {
      const payment = await createPaymentToken(order.id)
      setPaymentLink(payment.redirect_url)
    } catch (err) {
      setPayError(err.response?.data?.message || err.message || 'Gagal menyiapkan pembayaran.')
    } finally {
      setPreparingPayment(false)
    }
  }

  useEffect(() => {
    if (!order || tokenRequested.current || order.status !== 'Menunggu Pembayaran') return
    tokenRequested.current = true
    preparePayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

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
  }, [order, waiting])

  // Setelah lunas, otomatis dibawa ke Riwayat Pesanan
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
                <div className="mt-1.5 text-xs text-stone-500">
                  {order.type === 'ambil'
                    ? `Ambil sendiri · ${order.address}`
                    : `Diantar · ongkir ${rupiah(order.shipping)}`}
                </div>
              </div>
              <div className="text-xs text-stone-500">
                <div className="font-bold text-matcha-900">Metode pembayaran</div>
                <div>QRIS / E-wallet via Midtrans</div>
                <div className="mt-1">Pembayaran diverifikasi oleh server, bukan oleh browser.</div>
              </div>
            </div>

            <div className="mt-5">
              {preparingPayment && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-matcha-200 bg-white px-4 py-3 text-sm text-stone-600">
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Menyiapkan pembayaran Midtrans...
                </div>
              )}

              {!preparingPayment && payError && (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  <p>{payError}</p>
                  <button type="button" onClick={preparePayment} className="btn-outline-matcha mt-2 !py-1.5 text-xs">
                    Coba lagi
                  </button>
                </div>
              )}

              {!preparingPayment && !payError && paymentLink && (
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-matcha flex w-full items-center justify-center gap-2 no-underline"
                >
                  <i className="bi bi-box-arrow-up-right" />
                  Buka Pembayaran Midtrans
                </a>
              )}
            </div>

            {netError && (
              <div className="mt-4 animate-pop-in rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status">
                Koneksi bermasalah, sedang mencoba memeriksa status lagi...
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
