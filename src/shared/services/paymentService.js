import api, { USE_MOCK } from './api'

/**
 * KONTRAK API YANG DIHARAPKAN
 *
 * GET /pembayaran/:orderId/status
 *   -> { status: "pending" | "paid" | "expired" | "failed" }
 *
 * PENTING (keamanan): status "paid" HANYA boleh diisi backend setelah menerima
 * notifikasi (webhook/callback) dari penyedia pembayaran (Midtrans, Xendit, dll.)
 * yang sudah diverifikasi tanda tangannya. Frontend tidak pernah menentukan
 * sendiri bahwa sebuah pesanan sudah dibayar, jadi tidak ada tombol "Saya sudah
 * bayar" yang bisa disalahgunakan.
 */
export async function getPaymentStatus(orderId) {
  if (USE_MOCK) {
    // Mode contoh: dianggap lunas hanya kalau tombol simulasi ditekan
    const paid = sessionStorage.getItem(`matcha_mock_paid_${orderId}`) === '1'
    return { status: paid ? 'paid' : 'pending' }
  }
  const { data } = await api.get(`/pembayaran/${orderId}/status`)
  return data
}

/** Hanya untuk mode contoh (tanpa backend): pura-pura pembayaran QRIS masuk. */
export function simulateMockPayment(orderId) {
  sessionStorage.setItem(`matcha_mock_paid_${orderId}`, '1')
}
