import DrinkImage from '../../shared/components/DrinkImage'
import { rupiah } from '../../shared/utils/format'

/** Kartu produk dengan tombol "+" bulat di pojok kanan bawah (sesuai desain) */
export default function ProductCard({ product, selected = false, onAdd, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`card-soft group overflow-hidden p-2.5 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-lift ${
        onSelect ? 'cursor-pointer' : ''
      } ${selected ? 'ring-2 ring-matcha-600' : ''}`}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]">
        <DrinkImage src={product.image} tone={product.tone} alt={product.name} />
      </div>
      <div className="flex items-end justify-between gap-2 px-1 pb-1 pt-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-matcha-900">{product.name}</div>
          <div className="mt-0.5 text-sm font-bold text-matcha-700">{rupiah(product.price)}</div>
          <div className="text-[11px] text-stone-400">{product.tag}</div>
        </div>
        <button
          type="button"
          aria-label={`Tambah ${product.name}`}
          onClick={(e) => {
            e.stopPropagation()
            onAdd?.(product)
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-matcha-700 text-white transition-all duration-300 ease-out hover:scale-110 hover:rotate-90 hover:bg-matcha-800 active:scale-95"
        >
          <i className="bi bi-plus-lg text-sm" />
        </button>
      </div>
    </div>
  )
}
