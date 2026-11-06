import api from './api'

/**
 * Kontrak API backend:
 *
 * POST /payments/token              body: { orderId }
 *   -> { success, message, data: { token, redirect_url, order_id } }
 *
 * GET  /payments/:orderId/status
 *   -> { success, message, data: { status: "pending"|"paid"|"expired"|"failed" } }
 *
 * Status "paid" hanya diisi backend setelah webhook Midtrans terverifikasi.
 */
export async function createPaymentToken(orderId) {
  const { data } = await api.post('/payments/token', { orderId })
  return data?.data ?? data
}

export async function getPaymentStatus(orderId) {
  const { data } = await api.get(`/payments/${orderId}/status`)
  return data?.data ?? data
}
