import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('matcha_cart'))
    if (Array.isArray(saved)) return saved
  } catch {
    /* abaikan */
  }
  return []
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
            i.productVariantId === item.productVariantId &&
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
