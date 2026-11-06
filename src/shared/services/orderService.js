import api from './api'

/**
 * Kontrak API backend:
 *
 * POST /orders      (wajib login)
 *   body: { items: [{ productId, productVariantId?, quantity }], customerName?,
 *           customerPhone, shippingAddress?, shippingFee? }
 *   -> { success, message, data: order }
 *
 * GET /orders       (wajib login; admin melihat semua, konsumen hanya miliknya)
 *   -> { success, message, data: [order] }
 *
 * PATCH /orders/:id/status  (khusus admin)  body: { status }
 *
 * Status order backend: PENDING_PAYMENT | PROCESSING | COMPLETED | CANCELLED
 */

export const PAYMENT_WINDOW_MS = 15 * 60 * 1000

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'Menunggu Pembayaran',
  PROCESSING: 'Diproses',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

const toNumber = (value) => Number(value) || 0

/** Ubah order dari backend menjadi bentuk yang dipakai halaman frontend. */
export function normalizeOrder(order) {
  const items = (order.orderItems || order.items || []).map((item) => ({
    name: item.product?.name || item.name || 'Produk',
    size: item.productVariant?.variantName || item.size || '',
    sweet: item.sweet || '',
    qty: item.quantity ?? item.qty ?? 1,
    unitPrice: toNumber(item.unitPrice),
    note: item.note || '',
  }))

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  const shipping = toNumber(order.shippingFee ?? order.shipping)
  const total = toNumber(order.totalAmount ?? order.total) || subtotal + shipping

  return {
    id: order.id,
    type: shipping > 0 ? 'antar' : 'ambil',
    items,
    subtotal,
    discount: toNumber(order.discount),
    shipping,
    total,
    name: order.customerName || order.name || '',
    phone: order.customerPhone || order.phone || '',
    address: order.shippingAddress || order.address || '',
    pickup: order.pickup || '',
    status: ORDER_STATUS[order.orderStatus] || order.status || 'Menunggu Pembayaran',
    orderStatus: order.orderStatus,
    paymentStatus: order.payment?.paymentStatus || order.paymentStatus || null,
    createdAt: order.createdAt ? new Date(order.createdAt).getTime() : Date.now(),
  }
}

/** Buat pesanan baru di backend. */
export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload)
  return normalizeOrder(data?.data ?? data)
}

/** Daftar pesanan milik akun yang login (butuh token). */
export async function getOrders(user) {
  if (!user) return []
  const { data } = await api.get('/orders')
  const list = Array.isArray(data?.data) ? data.data : []
  return list.map(normalizeOrder)
}

/** Ubah status pesanan (khusus admin). */
export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status })
  return normalizeOrder(data?.data ?? data)
}

/** Pesanan belum dibayar dan sudah lewat batas waktu -> tampil "Kedaluwarsa". */
export const displayStatus = (order) =>
  order.status === 'Menunggu Pembayaran' && Date.now() - order.createdAt > PAYMENT_WINDOW_MS
    ? 'Kedaluwarsa'
    : order.status

/** Pesanan tamu tidak didukung backend (semua order wajib login). */
export async function claimGuestOrders() {}
