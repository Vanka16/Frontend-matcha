import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { menu, sizes, sweetness } from '../data/menu'
import { rupiah } from '../../shared/utils/format'
import { useCart } from '../context/CartContext'

export default function KatalogPage() {
  const { add } = useCart()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(menu[0])
  const [size, setSize] = useState('M')
  const [sweet, setSweet] = useState('50%')
  const [note, setNote] = useState('')
  const [added, setAdded] = useState(false)

  const sizeAdd = sizes.find((s) => s.key === size).add
  const unitPrice = selected.price + sizeAdd

  const choose = (p) => {
    setSelected(p)
    setAdded(false)
  }

  const addToCart = () => {
    add({
      productId: selected.id,
      name: selected.name,
      tone: selected.tone,
      image: selected.image,
      size,
      sweet,
      note,
      unitPrice,
      qty: 1,
    })
    setAdded(true)
    setNote('')
  }

  return (
    <div className="w-full">
      <div className="card-soft p-5 sm:p-6">
        <h2 className="text-base font-bold text-matcha-900">Semua Menu</h2>
        <p className="text-xs text-stone-500">Pilih produk untuk melihat detail dan varian.</p>

        <div className="row g-4 mt-1">
          <div className="col-12 col-lg-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {menu.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={selected.id === p.id}
                  onSelect={() => choose(p)}
                  onAdd={choose}
                />
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="rounded-2xl border border-matcha-100 bg-matcha-50/60 p-4">
              <h3 className="text-sm font-bold text-matcha-900">Sesuaikan Minuman</h3>
              <p className="mt-0.5 text-xs text-stone-500">{selected.name}</p>

              <div className="mt-4">
                <div className="mb-1.5 text-xs font-semibold text-stone-600">Ukuran</div>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSize(s.key)}
                      className={`h-8 w-10 rounded-lg border text-xs font-bold transition ${
                        size === s.key
                          ? 'border-matcha-700 bg-matcha-700 text-white'
                          : 'border-matcha-200 bg-white text-stone-600 hover:border-matcha-500'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
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

              <button onClick={addToCart} className="btn-matcha mt-3 w-full">
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
