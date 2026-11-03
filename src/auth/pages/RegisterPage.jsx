import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthBackground from '../components/AuthBackground'
import Logo from '../../shared/components/Logo'
import { homeByRole, useAuth } from '../../shared/auth/AuthContext'

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Sandi minimal 6 karakter')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      navigate(location.state?.from?.pathname || homeByRole(user.role), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Pendaftaran gagal, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <AuthBackground variant="register" />

      <Link to="/" className="relative z-10 block px-6 pt-6 sm:absolute sm:left-12 sm:top-8 sm:px-0 sm:pt-0">
        <Logo light className="hidden sm:flex" />
        <Logo className="sm:hidden" />
      </Link>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-8 shadow-soft">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-matcha-900">Daftar</h2>
            <p className="mt-1 text-sm text-stone-500">Buat akun untuk mulai memesan</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 [&>*]:animate-fade-up [&>*:nth-child(1)]:[animation-delay:150ms] [&>*:nth-child(2)]:[animation-delay:370ms] [&>*:nth-child(3)]:[animation-delay:370ms] [&>*:nth-child(n+4)]:[animation-delay:480ms]">
            <div>
              <label className="label-matcha" htmlFor="name">Nama</label>
              <input
                id="name"
                name="name"
                required
                className="input-matcha"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="label-matcha" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-matcha"
                placeholder="Masukkan email aktif"
                value={form.email}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="label-matcha" htmlFor="password">Sandi</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  className="input-matcha pr-10"
                  placeholder="Buat kata sandi"
                  value={form.password}
                  onChange={onChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-matcha-700"
                  aria-label={showPw ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-pop-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn-matcha w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar'}
            </button>

            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="h-px flex-1 bg-stone-200" />
              atau
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              onClick={loginWithGoogle}
            >
              <i className="bi bi-google" /> Daftar dengan Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Sudah punya akun?{' '}
            <Link to="/login" state={location.state} className="font-semibold text-matcha-700 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
