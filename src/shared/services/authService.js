import api, { API_URL, USE_MOCK } from './api'

/**
 * KONTRAK API YANG DIHARAPKAN (silakan sesuaikan dengan backend kamu):
 *
 * POST /auth/login     body: { email, password }
 *   -> { token: "xxx", user: { id, name, email, role: "admin" | "konsumen" } }
 *
 * POST /auth/register  body: { name, email, password }
 *   -> { token, user }   (atau cukup { message } lalu user diarahkan ke login)
 *
 * GET  /auth/google    -> redirect OAuth Google, lalu kembali ke /auth/callback?token=...
 */

const mockUser = (email, name) => ({
  token: 'mock-token',
  user: {
    id: 1,
    name: name || (email.startsWith('admin') ? 'Admin Telang' : 'Nadia Putri'),
    email,
    role: email.startsWith('admin') ? 'admin' : 'konsumen',
  },
})

export async function login({ email, password }) {
  if (USE_MOCK) {
    if (!email || !password) throw new Error('Email dan password wajib diisi')
    return mockUser(email)
  }
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function register({ name, email, password }) {
  if (USE_MOCK) {
    return mockUser(email, name)
  }
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export function loginWithGoogle() {
  if (USE_MOCK) {
    alert('Login Google akan aktif setelah API terhubung.')
    return
  }
  window.location.href = `${API_URL}/auth/google`
}
