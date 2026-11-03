import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Decor, { footerDecor, heroDecor, sectionDecor } from '../../shared/components/Decor'
import Reveal from '../../shared/components/Reveal'
import Logo from '../../shared/components/Logo'
import DrinkImage from '../../shared/components/DrinkImage'
import { homeByRole, useAuth } from '../../shared/auth/AuthContext'
import ProductCard from '../components/ProductCard'
import { getImage } from '../../shared/utils/assets'
import { menu } from '../data/menu'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const sliderRef = useRef(null)

  const scroll = (dir) => sliderRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  // Menu bisa dipesan tanpa login (login hanya memberi diskon & riwayat pesanan)
  const goMenu = () => navigate('/konsumen/katalog')

  const heroImg = getImage('hero')
  const navLink = 'text-sm font-medium text-stone-600 no-underline transition hover:text-matcha-700'

  return (
    <div className="min-h-screen bg-matcha-50">
      {/* Navbar */}
      <header className="relative z-20 mx-auto flex animate-fade-in max-w-[1600px] items-center gap-6 px-6 py-5 sm:px-10 lg:px-16">
        <Logo />
        <nav className="ml-10 hidden items-center gap-6 md:flex">
          <a href="#beranda" className={`${navLink} border-b-2 border-matcha-700 pb-0.5 !text-matcha-900`}>Beranda</a>
          <a href="#produk" className={navLink}>Katalog</a>
          <a href="#tentang" className={navLink}>Tentang Kami</a>
          <a href="#kontak" className={navLink}>Kontak</a>
          <Link to="/konsumen/riwayat" className={navLink}>Riwayat Pesanan</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden lg:block">
            <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400" />
            <input
              className="w-52 rounded-full border border-matcha-200 bg-white py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-stone-400 focus:border-matcha-500"
              placeholder="Cari matcha favoritmu..."
            />
          </div>
          {user ? (
            <Link to={homeByRole(user.role)} className="btn-matcha !rounded-full !py-1.5 no-underline">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-matcha-700 px-4 py-1.5 no-underline text-sm font-semibold text-matcha-700 transition hover:bg-white">
                Masuk
              </Link>
              <Link to="/daftar" className="btn-matcha !rounded-full !py-1.5 no-underline">
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-matcha-100 via-matcha-50 to-matcha-200">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-matcha-300/60 to-transparent" />
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 left-0 h-40 w-full animate-drift">
          <path d="M0 120 C200 40 360 150 560 110 C760 70 900 20 1200 90 L1200 200 L0 200Z" fill="#84c030" opacity=".55" />
        </svg>
        <Decor items={heroDecor} />

        <div className="relative mx-auto grid max-w-[1600px] items-center gap-8 px-6 pb-16 pt-6 sm:px-10 md:grid-cols-2 lg:px-16">
          <div className="animate-fade-up">
            <h1 className="text-4xl font-extrabold leading-tight text-matcha-900 sm:text-5xl">
              Nikmati Keaslian
              <br />
              Matcha Alami
            </h1>
            <p className="mt-4 max-w-sm text-sm text-stone-600">
              Premium grade Uji matcha yang disiapkan dengan cinta untuk momen berharga mu.
            </p>
            <button onClick={goMenu} className="btn-matcha group mt-6 !rounded-full !px-5">
              Lihat Menu Kami
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                <i className="bi bi-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          <div className="relative ml-auto h-72 w-full max-w-lg animate-pop-in [animation-delay:200ms] sm:h-96">
            <div className="absolute inset-x-4 bottom-0 top-8 animate-ring rounded-[2.5rem] border-2 border-matcha-500/60" />
            <div className="absolute inset-x-4 bottom-0 top-8 animate-ring rounded-[2.5rem] border-2 border-matcha-500/60 [animation-delay:2.2s]" />
            <div className="absolute inset-x-4 bottom-0 top-8 rounded-[2.5rem] bg-gradient-to-br from-matcha-300 to-matcha-400/80 shadow-lift" />
            <div className="absolute inset-0 flex items-center justify-center">
              {heroImg ? (
                <img
                  src={heroImg}
                  alt="Matcha and Me"
                  className="h-full w-full animate-float rounded-[2.5rem] object-cover shadow-lift"
                />
              ) : (
                <div className="h-full w-56 animate-float">
                  <DrinkImage tone="latte" rounded={false} className="!bg-transparent" alt="Iced matcha latte" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Preview produk */}
      {/* Pita teks berjalan */}
      <div className="overflow-hidden bg-matcha-800 py-3 text-matcha-100">
        <div className="flex w-max animate-marquee items-center">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {['Premium Grade Uji', 'Dibuat Segar Setiap Hari', 'Less Sugar, More Matcha', 'Disiapkan dengan Cinta', 'Matcha and Me'].map((t) => (
                <span key={t} className="flex items-center text-sm font-semibold uppercase tracking-[0.18em]">
                  <span className="mx-8 text-matcha-300">✦</span>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="produk" className="relative overflow-hidden bg-gradient-to-b from-matcha-100 to-matcha-200 pb-16 pt-12">
        <Decor items={sectionDecor} />
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between">
            <Reveal className="mx-auto text-center">
              <h2 className="text-2xl font-extrabold text-matcha-900">Preview Produk &amp; Menu Utama</h2>
            </Reveal>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => scroll(-1)} aria-label="Sebelumnya" className="flex h-8 w-8 items-center justify-center rounded-full border border-matcha-300 bg-white text-matcha-700 hover:bg-matcha-50">
                <i className="bi bi-chevron-left text-xs" />
              </button>
              <button onClick={() => scroll(1)} aria-label="Berikutnya" className="flex h-8 w-8 items-center justify-center rounded-full border border-matcha-300 bg-white text-matcha-700 hover:bg-matcha-50">
                <i className="bi bi-chevron-right text-xs" />
              </button>
            </div>
          </div>

          <div ref={sliderRef} className="mt-8 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none]">
            {menu.map((p, i) => (
              <Reveal key={p.id} delay={i * 120} className="w-64 shrink-0 sm:w-[calc(25%-15px)] sm:min-w-[220px]">
                <ProductCard product={p} onAdd={goMenu} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer ringkas (tujuan link Tentang Kami & Kontak) */}
      <footer className="relative overflow-hidden bg-matcha-900 text-matcha-100">
        <Decor items={footerDecor} />
        <div className="relative mx-auto grid max-w-[1600px] gap-8 px-6 py-10 sm:px-10 sm:grid-cols-2 lg:px-16">
          <div id="tentang">
            <Logo light />
            <p className="mt-3 max-w-sm text-sm text-matcha-200">
              Matcha and Me menyajikan matcha premium grade Uji yang disiapkan segar untuk setiap momen.
            </p>
          </div>
          <div id="kontak" className="text-sm">
            <div className="mb-2 font-semibold text-white">Kontak</div>
            <p className="text-matcha-200">Gerai Telang · Surabaya</p>
            <p className="text-matcha-200">halo@matchaandme.id</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
