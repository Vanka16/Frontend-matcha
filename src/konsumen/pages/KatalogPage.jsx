import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { sweetness } from '../data/menu'
import { rupiah } from '../../shared/utils/format'
import { useCart } from '../context/CartContext'
import { getProducts } from '../services/productService'

export default function KatalogPage() {
  const { add } = useCart()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [variantId, setVariantId] = useState('')
  const [sweet, setSweet] = useState('50%')
  const [note, setNote] = useState('')
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = () => {
    setLoading(true)
    setError('')
    getProducts()
      .then((list) => {
        setProducts(list)
        setSelected(list[0] || null)
        setVariantId(list[0]?.variants[0]?.id || '')
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Gagal memuat produk dari server.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const selectedVariant = selected?.variants.find((v) => v.id === variantId) || selected?.variants[0]
  const unitPrice = selected ? selected.price + (selectedVariant?.additionalPrice || 0) : 0

  const choose = (p) => {
    setSelected(p)
    setVariantId(p.variants[0]?.id || '')
    setAdded(false)
  }

  const addToCart = () => {
    if (!selected) return
    add({
      productId: selected.id,
      productVariantId: selectedVariant?.id || null,
      name: selected.name,
      variantName: selectedVariant?.name || '',
      tone: selected.tone,
      image: selected.image,
      size: selectedVariant?.name || '',
      sweet,
      note,
      unitPrice,
      qty: 1,
    })
    setAdded(true)
    setNote('')
  }

  if (loading) {
    return (
      <div className="card-soft flex items-center justify-center p-12 text-sm text-stone-500">
        <i className="bi bi-arrow-repeat mr-2 animate-spin text-matcha-700" />
        Memuat produk dari server...
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-soft p-10 text-center">
        <p className="text-sm text-stone-600">{error}</p>
        <button type="button" onClick={loadProducts} className="btn-matcha mt-4">
          Coba lagi
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="card-soft p-10 text-center">
        <p className="text-sm text-stone-500">Belum ada produk aktif di server.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="card-soft p-5 sm:p-6">
        <h2 className="text-base font-bold text-matcha-900">Semua Menu</h2>
        <p className="text-xs text-stone-500">Pilih produk untuk melihat detail dan varian.</p>

        <div className="row g-4 mt-1">
          <div className="col-12 col-lg-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={selected?.id === p.id}
                  onSelect={() => choose(p)}
                  onAdd={choose}
                />
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="rounded-2xl border border-matcha-100 bg-matcha-50/60 p-4">
              <h3 className="text-sm font-bold text-matcha-900">Sesuaikan Minuman</h3>
              <p className="mt-0.5 text-xs text-stone-500">{selected?.name}</p>

              <div className="mt-4">
                <div className="mb-1.5 text-xs font-semibold text-stone-600">Ukuran / Varian</div>
                <div className="flex flex-wrap gap-2">
                  {selected?.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      disabled={v.stock <= 0}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedVariant?.id === v.id
                          ? 'border-matcha-700 bg-matcha-700 text-white'
                          : 'border-matcha-200 bg-white text-stone-600 hover:border-matcha-500'
                      }`}
                    >
                      {v.name}
                      {v.additionalPrice > 0 && ` +${rupiah(v.additionalPrice)}`}
                    </button>
                  ))}
                  {selected?.variants.length === 0 && (
                    <span className="text-xs text-stone-400">Varian belum tersedia</span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 text-xs font-semibold text-stone-600">Tingkat kemanisan</div>
                <div className="flex gap-2">
                  {sweetness.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSweet(s)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                        sweet === s
                          ? 'border-matcha-700 bg-matcha-700 text-white'
                          : 'border-matcha-200 bg-white text-stone-600 hover:border-matcha-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-stone-600" htmlFor="catatan">
                  Catatan tambahan
                </label>
                <input
                  id="catatan"
                  className="input-matcha !py-2 !text-xs"
                  placeholder="Contoh: es sedikit"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-matcha-100 pt-4">
                <span className="text-xs text-stone-500">Total harga</span>
                <span className="text-lg font-extrabold text-matcha-700">{rupiah(unitPrice)}</span>
              </div>

              <button
                onClick={addToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className="btn-matcha mt-3 w-full"
              >
                <i className="bi bi-plus-lg" /> Tambah ke Keranjang
              </button>

              {added && (
                <button
                  onClick={() => navigate('/konsumen/keranjang')}
                  className="mt-2 w-full text-center text-xs font-semibold text-matcha-700 hover:underline"
                >
                  Ditambahkan ✓ — Lihat keranjang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
