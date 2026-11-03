import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { menu } from '../data/menu'
import { USE_MOCK } from '../../shared/services/api'

const CartContext = createContext(null)

// Isi contoh supaya halaman keranjang langsung terlihat seperti di desain (hanya saat mode mock)
const demoItems = [
  { id: 'd1', productId: 1, name: menu[0].name, tone: 'latte', size: 'M', sweet: '50%', unitPrice: 35000, qty: 2, note: '' },
  { id: 'd2', productId: 2, name: menu[1].name, tone: 'choco', size: 'L', sweet: '100%', unitPrice: 45000, qty: 1, note: '' },
  { id: 'd3', productId: 3, name: menu[2].name, tone: 'latte', size: 'M', sweet: '100%', unitPrice: 41000, qty: 1, note: '' },
]

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('matcha_cart'))
    if (Array.isArray(saved)) return saved
  } catch {
    /* abaikan */
  }
  return USE_MOCK ? demoItems : []
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    localStorage.setItem('matcha_cart', JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    const add = (item) =>
      setItems((list) => {
        const same = list.find(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.sweet === item.sweet &&
            i.note === item.note,
        )
        if (same) return list.map((i) => (i === same ? { ...i, qty: i.qty + item.qty } : i))
        return [...list, { ...item, id: crypto.randomUUID() }]
      })

    const setQty = (id, qty) =>
      setItems((list) => list.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))

    const remove = (id) => setItems((list) => list.filter((i) => i.id !== id))
    const clear = () => setItems([])

    const count = items.reduce((s, i) => s + i.qty, 0)
    const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)

    return { items, add, setQty, remove, clear, count, subtotal }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
