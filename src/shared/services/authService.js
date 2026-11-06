import api from './api'

/**
 * Kontrak API backend (Express):
 *
 * POST /users/login     body: { email, password }
 *   -> { success, message, data: { token, user: { id, name, email, role } } }
 *
 * POST /users/register  body: { name, email, password, role? }
 *   -> { success, message, data: user }   (belum mengembalikan token)
 *
 * Backend memakai role ADMIN / CUSTOMER, frontend memakai admin / konsumen.
 */

const normalizeRole = (role) => (String(role).toUpperCase() === 'ADMIN' ? 'admin' : 'konsumen')

/** Buka envelope { success, message, data } dan samakan bentuk role. */
const normalizeAuth = (payload) => {
  const data = payload?.data ?? payload
  if (!data?.token || !data?.user) {
    throw new Error(payload?.message || 'Respons autentikasi dari server tidak valid')
  }
  return {
    token: data.token,
    user: { ...data.user, role: normalizeRole(data.user.role) },
  }
}

export async function login({ email, password }) {
  const { data } = await api.post('/users/login', { email, password })
  return normalizeAuth(data)
}

export async function register({ name, email, password }) {
  // Backend hanya membuat akun, jadi login sekali lagi untuk mendapatkan token.
  await api.post('/users/register', { name, email, password })
  const { data } = await api.post('/users/login', { email, password })
  return normalizeAuth(data)
}

export function loginWithGoogle() {
  alert('Login Google belum tersedia di backend. Silakan masuk dengan email dan password.')
}
