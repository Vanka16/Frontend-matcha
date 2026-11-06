import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
})

// Kirim token otomatis di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('matcha_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Kalau token kadaluarsa / tidak valid, bersihkan sesi lalu arahkan ke login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('matcha_token')
      localStorage.removeItem('matcha_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export default api
