import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import { claimGuestOrders } from '../../konsumen/services/orderService'

const AuthContext = createContext(null)

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('matcha_user'))
  } catch {
    return null
  }
}

export const homeByRole = (role) => (role === 'admin' ? '/admin' : '/konsumen')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const saveSession = useCallback((data) => {
    localStorage.setItem('matcha_token', data.token)
    localStorage.setItem('matcha_user', JSON.stringify(data.user))
    setUser(data.user)
    // Riwayat pesanan saat masih jadi tamu ikut dipindah ke akun (gagal pun tidak mengganggu login)
    claimGuestOrders(data.user).catch(() => {})
    return data.user
  }, [])

  const login = useCallback(
    async (credentials) => saveSession(await authService.login(credentials)),
    [saveSession],
  )

  const register = useCallback(
    async (payload) => saveSession(await authService.register(payload)),
    [saveSession],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('matcha_token')
    localStorage.removeItem('matcha_user')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, loginWithGoogle: authService.loginWithGoogle }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
