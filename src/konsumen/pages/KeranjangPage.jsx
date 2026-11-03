import { Link, useNavigate } from 'react-router-dom'
import DrinkImage from '../../shared/components/DrinkImage'
import { rupiah } from '../../shared/utils/format'
import { useCart } from '../context/CartContext'

export default function KeranjangPage() {
  const { items, setQty, remove, subtotal } = useCart()
  const navigate = useNavigate()

  return (
    <div className="w-full">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card-soft p-5 sm:p-6">
            <h2 className="text-base font-bold text-matcha-900">Keranjang Saya</h2>
            <p className="text-xs text-stone-500">Ubah jumlah atau hapus menu sebelum melanjutkan pembayaran.</p>

            {items.length === 0 ? (
              <div className="py-14 text-center">
                <i className="bi bi-bag text-4xl text-matcha-300" />
                <p className="mt-2 text-sm text-stone-500">Keranjang kamu masih kosong.</p>
                <Link to="/konsumen/katalog" className="btn-matcha mt-4">
                  Lihat Katalog Menu
                </Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-matcha-100">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <DrinkImage src={item.image} tone={item.tone} alt={item.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-matcha-900">{item.name}</div>
                      <div className="text-xs text-stone-500">
                        Ukuran {item.size} • Manis {item.sweet}
                        {item.note ? ` • ${item.note}` : ''}
                      </div>
                      <div className="mt-1 text-sm font-bold text-matcha-700">{rupiah(item.unitPrice)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Kurangi"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-matcha-200 text-matcha-700 hover:bg-matcha-50"
                      >
                        <i className="bi bi-dash" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        aria-label="Tambah"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-matcha-200 text-matcha-700 hover:bg-matcha-50"
                      >
                        <i className="bi bi-plus" />
                      </button>
                    </div>

                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card-soft p-5">
            <h3 className="text-sm font-bold text-matcha-900">Ringkasan Pesanan</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Subtotal</dt>
                <dd className="font-semibold">{rupiah(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Ongkir</dt>
                <dd className="text-xs font-semibold text-stone-600">Dihitung saat checkout (jika diantar)</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-matcha-100 pt-4">
              <span className="text-sm font-semibold text-matcha-900">Total sementara</span>
              <span className="text-lg font-extrabold text-matcha-700">{rupiah(subtotal)}</span>
            </div>
            <button
              onClick={() => navigate('/konsumen/checkout')}
              disabled={items.length === 0}
              className="btn-matcha mt-4 w-full"
            >
              Lanjut Checkout
            </button>
            <p className="mt-3 text-[11px] text-stone-400">
              <i className="bi bi-shield-check mr-1" />
              Pembayaran aman &amp; terverifikasi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
