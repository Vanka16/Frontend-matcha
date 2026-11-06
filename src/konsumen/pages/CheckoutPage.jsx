import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/auth/AuthContext'
import { rupiah } from '../../shared/utils/format'
import { useCart } from '../context/CartContext'
import { createOrder } from '../../shared/services/orderService'
import { GERAI, ONGKIR_FLAT, hitungOngkir, orderTypes, pickupOptions } from '../data/menu'

export default function CheckoutPage() {
  const { items, count, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [type, setType] = useState('antar')
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '' })
  const [pickup, setPickup] = useState(pickupOptions[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const antar = type === 'antar'
  const ongkir = antar ? hitungOngkir() : 0
  const total = subtotal + ongkir

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        productVariantId: item.productVariantId || null,
        quantity: item.qty,
      })),
      customerName: form.name,
      customerPhone: form.phone,
      shippingAddress: antar ? form.address : `Ambil di ${GERAI} · ${pickup}`,
      shippingFee: ongkir,
    }

    try {
      const order = await createOrder(payload)
      // Halaman pembayaran akan meminta token Midtrans untuk order ini.
      sessionStorage.setItem('matcha_order', JSON.stringify(order))
      clear()
      navigate('/konsumen/pembayaran')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal membuat pesanan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-matcha-100 text-2xl text-matcha-700">
          <i className="bi bi-person-lock" />
        </div>
        <h2 className="mt-3 text-base font-bold text-matcha-900">Masuk dulu untuk checkout</h2>
        <p className="mt-1 text-sm text-stone-500">
          Pesanan akan disimpan ke akunmu dan pembayaran diproses melalui Midtrans.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/login" state={{ from: location }} className="btn-matcha no-underline">
            Masuk
          </Link>
          <Link to="/daftar" state={{ from: location }} className="btn-outline-matcha no-underline">
            Daftar
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center">
        <p className="text-sm text-stone-500">Belum ada menu di keranjang.</p>
        <Link to="/konsumen/katalog" className="btn-matcha mt-4">
          Pilih Menu
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card-soft p-5 sm:p-6">
            <h2 className="text-base font-bold text-matcha-900">Konfirmasi Pesanan</h2>
            <p className="text-xs text-stone-500">Pilih diantar atau ambil sendiri, lalu lengkapi datanya.</p>

            <h3 className="mt-5 text-sm font-bold text-matcha-900">1. Jenis Pesanan</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {orderTypes.map((o) => {
                const active = type === o.key
                return (
                  <button
                    type="button"
                    key={o.key}
                    onClick={() => setType(o.key)}
                    aria-pressed={active}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                      active
                        ? 'border-matcha-700 bg-matcha-50 ring-1 ring-matcha-700'
                        : 'border-matcha-200 bg-white hover:-translate-y-0.5 hover:border-matcha-500 hover:shadow-soft'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-colors duration-300 ${
                        active ? 'bg-matcha-700 text-white' : 'bg-matcha-100 text-matcha-700'
                      }`}
                    >
                      <i className={`bi ${o.icon}`} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-matcha-900">{o.title}</span>
                      <span className="block text-xs text-stone-500">{o.desc}</span>
                      <span className="block text-xs font-semibold text-matcha-700">
                        {o.key === 'antar' ? `Ongkir flat ${rupiah(ONGKIR_FLAT)}` : 'Gratis ongkir'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <h3 className="mt-6 text-sm font-bold text-matcha-900">
              2. {antar ? 'Alamat Pengiriman' : 'Data Pengambilan'}
            </h3>
            <div key={type} className="row g-3 mt-0 animate-fade-up">
              <div className="col-12 col-md-6">
                <label className="label-matcha !text-xs" htmlFor="name">
                  {antar ? 'Nama penerima' : 'Nama pengambil'}
                </label>
                <input id="name" name="name" required className="input-matcha" placeholder="Nama lengkap" value={form.name} onChange={onChange} />
              </div>
              <div className="col-12 col-md-6">
                <label className="label-matcha !text-xs" htmlFor="phone">Nomor telepon</label>
                <input id="phone" name="phone" required type="tel" className="input-matcha" placeholder="08xxxxxxxxxx" value={form.phone} onChange={onChange} />
              </div>

              {antar ? (
                <>
                  <div className="col-12">
                    <label className="label-matcha !text-xs" htmlFor="address">Alamat lengkap</label>
                    <input id="address" name="address" required className="input-matcha" placeholder="Jalan, nomor rumah, kota, kode pos" value={form.address} onChange={onChange} />
                  </div>
                  <div className="col-12">
                    <div className="flex items-center justify-between rounded-xl border border-matcha-200 bg-matcha-50/60 px-4 py-3 text-sm">
                      <span className="text-stone-600">
                        <i className="bi bi-bicycle mr-2 text-matcha-700" />
                        Ongkir flat (berlaku untuk semua jarak)
                      </span>
                      <span className="font-bold text-matcha-700">{rupiah(ONGKIR_FLAT)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-12 col-md-6">
                    <label className="label-matcha !text-xs" htmlFor="pickup">Waktu ambil</label>
                    <select id="pickup" className="input-matcha" value={pickup} onChange={(e) => setPickup(e.target.value)}>
                      {pickupOptions.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="label-matcha !text-xs">Ambil di</div>
                    <div className="flex items-center gap-2 rounded-xl border border-matcha-200 bg-matcha-50/60 px-3.5 py-2.5 text-sm font-semibold text-matcha-900">
                      <i className="bi bi-geo-alt-fill text-matcha-700" />
                      {GERAI}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card-soft p-5">
            <h3 className="text-sm font-bold text-matcha-900">Ringkasan</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">{count} item pesanan</dt>
                <dd className="font-semibold">{rupiah(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Ongkir</dt>
                <dd className="font-semibold">{antar ? rupiah(ongkir) : <span className="text-matcha-700">Gratis</span>}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Jenis pesanan</dt>
                <dd className="font-semibold">{antar ? 'Diantar' : 'Ambil sendiri'}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-matcha-100 pt-4">
              <span className="text-sm font-semibold text-matcha-900">Total pembayaran</span>
              <span className="text-lg font-extrabold text-matcha-700">{rupiah(total)}</span>
            </div>

            <div className="mt-4 text-xs font-semibold text-stone-600">Metode pembayaran</div>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-matcha-700 bg-matcha-50 px-3 py-2.5 text-sm font-semibold text-matcha-900">
              <i className="bi bi-record-circle-fill text-matcha-700" />
              QRIS / E-wallet (Midtrans)
            </div>

            {error && (
              <div className="mt-3 animate-pop-in rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-matcha mt-4 w-full">
              {loading ? 'Memproses...' : 'Buat Pesanan & Bayar'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
