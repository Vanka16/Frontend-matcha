import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthBackground from '../components/AuthBackground'
import Logo from '../../shared/components/Logo'
import DrinkImage from '../../shared/components/DrinkImage'
import { getImage } from '../../shared/utils/assets'
import { homeByRole, useAuth } from '../../shared/auth/AuthContext'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login({ email: form.email, password: form.password })
      navigate(location.state?.from?.pathname || homeByRole(user.role), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <AuthBackground variant="login" />

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:px-16">
        {/* Sisi kiri: sambutan */}
        <div className="hidden self-stretch lg:flex lg:flex-col lg:py-6">
          <Link to="/" className="animate-slide-right">
            <Logo />
          </Link>
          <div className="mt-16 max-w-sm animate-fade-up [animation-delay:150ms]">
            <h1 className="text-3xl font-extrabold leading-tight text-matcha-900">
              Selamat Datang di Matcha and Me!
            </h1>
            <p className="mt-3 text-sm text-stone-500">
              Nikmati kesegaran matcha terbaik dalam setiap tegukan.
            </p>
          </div>
          <div className="mt-auto h-64 w-44 animate-float pb-4">
            <DrinkImage
              src={getImage('login') || getImage('hero')}
              tone="latte"
              rounded={false}
              className="!bg-transparent"
              alt="Matcha"
            />
          </div>
        </div>

        {/* Sisi kanan: kartu login */}
        <div className="mx-auto w-full max-w-md animate-pop-in lg:ml-auto lg:mr-0 rounded-3xl bg-white p-8 shadow-soft">
          <Link
            to="/"
            className="group mb-4 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 text-sm font-semibold text-matcha-700 no-underline transition hover:text-matcha-900"
          >
            <i className="bi bi-arrow-left transition-transform duration-200 group-hover:-translate-x-1" />
            Kembali
          </Link>
          <div className="mb-6 text-center">
            <Link to="/" className="mb-4 inline-block lg:hidden">
              <Logo />
            </Link>
            <h2 className="text-2xl font-extrabold text-matcha-900">Login</h2>
            <p className="mt-1 text-sm text-stone-500">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 [&>*]:animate-fade-up [&>*:nth-child(1)]:[animation-delay:150ms] [&>*:nth-child(2)]:[animation-delay:370ms] [&>*:nth-child(3)]:[animation-delay:370ms] [&>*:nth-child(n+4)]:[animation-delay:480ms]">
            <div>
              <label className="label-matcha" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-matcha"
                placeholder="Masukkan email Anda"
                value={form.email}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="label-matcha" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-matcha"
                placeholder="Masukkan password Anda"
                value={form.password}
                onChange={onChange}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-stone-600">
                <input
                  type="checkbox"
                  name="remember"
                  className="form-check-input mt-0"
                  checked={form.remember}
                  onChange={onChange}
                />
                Ingat saya
              </label>
              <a href="#" className="font-semibold text-matcha-700 hover:underline">
                Lupa password?
              </a>
            </div>

            {error && (
              <div className="animate-pop-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn-matcha w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="h-px flex-1 bg-stone-200" />
              atau
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            <button type="button" className="btn-outline-matcha w-full" onClick={loginWithGoogle}>
              <i className="bi bi-google" /> Masuk dengan Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Belum punya akun?{' '}
            <Link to="/daftar" state={location.state} className="font-semibold text-matcha-700 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
