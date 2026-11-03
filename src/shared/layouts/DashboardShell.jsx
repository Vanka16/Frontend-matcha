import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../auth/AuthContext'

/**
 * Kerangka dashboard (sidebar + topbar) yang dipakai admin dan konsumen.
 * Isi menu dikirim lewat props `nav`, jadi tiap role punya menunya sendiri.
 *
 * nav item: { to, label, icon, title, subtitle, end?, authOnly?, children?: [{ to, label, title, subtitle }] }
 * authOnly: menu hanya tampil kalau user sudah login (tamu tidak melihatnya).
 */
export default function DashboardShell({ nav, roleLabel }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  // Grup dropdown yang dibuka manual oleh user (key = item.to)
  const [openGroups, setOpenGroups] = useState({})

  // Cari judul halaman dari menu yang cocok dengan URL sekarang
  const meta = useMemo(() => {
    const flat = nav.flatMap((i) => [i, ...(i.children || [])])
    const hit = flat
      .filter(
        (i) => i.title && (location.pathname === i.to || location.pathname.startsWith(i.to + '/')),
      )
      .sort((a, b) => b.to.length - a.to.length)[0]
    return hit || { title: '', subtitle: '' }
  }, [nav, location.pathname])

  const initial = (user?.name || 'U').charAt(0).toUpperCase()
  const visibleNav = useMemo(() => nav.filter((i) => !i.authOnly || user), [nav, user])

  const toggleGroup = (key, current) =>
    setOpenGroups((g) => ({ ...g, [key]: !current }))

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition ${
      isActive ? 'bg-matcha-700 text-white shadow-sm' : 'text-stone-600 hover:bg-matcha-100'
    }`

  const subLinkClass = ({ isActive }) =>
    `block rounded-lg py-1.5 pl-11 pr-3 text-[13px] no-underline transition ${
      isActive ? 'font-semibold text-matcha-700' : 'text-stone-500 hover:text-matcha-700'
    }`

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {visibleNav.map((item) => {
          const groupActive = item.children?.some((c) => location.pathname.startsWith(c.to))
          // Terbuka kalau halaman aktif ada di grup ini, kecuali user menutupnya sendiri
          const isOpen = openGroups[item.to] ?? groupActive
          return (
            <div key={item.to}>
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.to, isOpen)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center gap-3 rounded-xl border-0 px-3 py-2.5 text-left text-sm font-medium transition ${
                      groupActive ? 'bg-matcha-700 text-white shadow-sm' : 'bg-transparent text-stone-600 hover:bg-matcha-100'
                    }`}
                  >
                    <i className={`bi ${item.icon}`} />
                    <span className="flex-1">{item.label}</span>
                    <i
                      className={`bi bi-chevron-down text-xs transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-0.5 space-y-0.5 pb-1">
                        {item.children.map((c) => (
                          <NavLink
                            key={c.to}
                            to={c.to}
                            className={subLinkClass}
                            tabIndex={isOpen ? 0 : -1}
                            onClick={() => setOpen(false)}
                          >
                            {c.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <NavLink to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
                  <i className={`bi ${item.icon}`} />
                  {item.label}
                </NavLink>
              )}
            </div>
          )
        })}
      </nav>

      {user ? (
        <div className="m-3 flex items-center gap-3 rounded-xl bg-matcha-100/70 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-matcha-700 text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold text-matcha-900">{user?.name}</div>
            <div className="truncate text-xs text-stone-500">{roleLabel}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="rounded-lg p-1.5 text-stone-500 transition hover:bg-white hover:text-matcha-700"
          >
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      ) : (
        <div className="m-3 rounded-xl bg-matcha-100/70 p-3">
          <div className="text-sm font-semibold text-matcha-900">Belum masuk</div>
          <p className="mt-0.5 text-xs text-stone-500">Masuk untuk diskon 5% &amp; simpan riwayat pesanan di akunmu.</p>
          <div className="mt-2 flex gap-2">
            <Link to="/login" state={{ from: location }} className="btn-matcha flex-1 !py-1.5 text-xs no-underline">
              Masuk
            </Link>
            <Link to="/daftar" state={{ from: location }} className="btn-outline-matcha flex-1 !py-1.5 text-xs no-underline">
              Daftar
            </Link>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-matcha-100 bg-matcha-100/40 lg:block">
        {sidebar}
      </aside>

      {/* Sidebar mobile (drawer) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-matcha-50 shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-matcha-100 bg-matcha-50/90 px-4 py-3 backdrop-blur sm:px-8">
          <button
            className="rounded-lg p-2 text-matcha-800 hover:bg-matcha-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <i className="bi bi-list text-xl" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight text-matcha-900">{meta.title}</h1>
            <p className="truncate text-xs text-stone-500">{meta.subtitle}</p>
          </div>
          <div className="relative hidden sm:block">
            <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400" />
            <input
              className="w-56 rounded-xl border border-matcha-200 bg-white py-2 pl-8 pr-3 text-sm outline-none placeholder:text-stone-400 focus:border-matcha-500"
              placeholder="Cari sesuatu..."
            />
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha-200 text-sm font-bold text-matcha-800">
                {initial}
              </div>
              <span className="hidden text-sm font-semibold text-matcha-900 sm:inline">
                {user.role === 'admin' ? 'Admin' : user.name?.split(' ')[0]}
              </span>
            </div>
          ) : (
            <Link to="/login" state={{ from: location }} className="btn-matcha !py-1.5 text-xs no-underline">
              <i className="bi bi-box-arrow-in-right" /> Masuk
            </Link>
          )}
        </header>

        <main className="px-4 py-6 sm:px-8">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
