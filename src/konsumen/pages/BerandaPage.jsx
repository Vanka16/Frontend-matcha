import { Link, useNavigate } from 'react-router-dom'
import DrinkImage from '../../shared/components/DrinkImage'
import ProductCard from '../components/ProductCard'
import { menu } from '../data/menu'

export default function BerandaPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-matcha-100 to-matcha-200 px-6 py-8 sm:px-10">
        <div className="relative z-10 max-w-md">
          <span className="text-[10px] font-bold tracking-[0.2em] text-matcha-600">MATCHA PREMIUM</span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-matcha-900">
            Nikmati Keaslian
            <br />
            Matcha Alami
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Premium grade Uji matcha untuk momen berharga.
          </p>
          <Link to="/konsumen/katalog" className="btn-matcha mt-5 !py-2">
            Lihat Menu Kami
          </Link>
        </div>
        <div className="absolute bottom-0 right-6 hidden h-44 w-36 sm:block md:right-16">
          <DrinkImage tone="latte" rounded={false} className="!bg-transparent" alt="Matcha" />
        </div>
      </section>

      {/* Paling banyak dicari */}
      <section className="mt-8">
        <h3 className="text-base font-bold text-matcha-900">Paling Banyak Dicari Bulan Ini 👑</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {menu.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => navigate('/konsumen/katalog')} />
          ))}
        </div>
      </section>
    </div>
  )
}
