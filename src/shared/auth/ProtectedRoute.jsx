import { Navigate, useLocation } from 'react-router-dom'
import { homeByRole, useAuth } from './AuthContext'

/** Halaman hanya boleh dibuka oleh user yang login dengan role tertentu. */
export function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (role && user.role !== role) return <Navigate to={homeByRole(user.role)} replace />
  return children
}

/**
 * Halaman yang boleh dibuka siapa saja (tamu maupun konsumen yang login).
 * Admin tetap diarahkan ke dashboard admin.
 */
export function OpenRoute({ children }) {
  const { user } = useAuth()
  if (user?.role === 'admin') return <Navigate to={homeByRole(user.role)} replace />
  return children
}

/**
 * Halaman login/daftar: kalau sudah login, arahkan kembali ke halaman asal
 * (mis. checkout) atau ke dashboard sesuai role.
 */
export function GuestRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (user) return <Navigate to={location.state?.from?.pathname || homeByRole(user.role)} replace />
  return children
}
