import api, { USE_MOCK } from '../../shared/services/api'

/**
 * KONTRAK API YANG DIHARAPKAN (silakan sesuaikan dengan backend kamu):
 *
 * POST /pesanan   (boleh TANPA token = pembeli tamu; kalau ada token = member)
 *   body: { items, jenis, penerima: { name, phone }, alamat, pickup }
 *   -> { id, status, subtotal, discount, shipping, total, createdAt }
 *   Diskon member & ongkir WAJIB dihitung ulang di backend, jangan percaya angka dari frontend.
 *
 * GET /pesanan/saya   (wajib token)  -> riwayat milik akun yang login
 *   -> [{ id, type, items, subtotal, discount, shipping, total, address, pickup,
 *         status, createdAt }]
 *
 * GET /pesanan/lacak?ids=MB-1,MB-2   (tanpa token)  -> riwayat tamu
 *   Frontend menyimpan nomor pesanan tamu di perangkat, lalu menanyakan statusnya ke sini.
 *   Backend sebaiknya membatasi (rate limit) dan hanya mengembalikan data yang perlu.
 *
 * POST /pesanan/klaim   (wajib token)  body: { ids: [...] }
 *   Dipanggil saat tamu login/daftar supaya pesanan tamunya pindah ke akunnya.
 *
 * Status "Dibayar" diisi backend lewat webhook penyedia pembayaran (lihat paymentService).
 *
 * Bentuk satu pesanan:
 *   items: [{ name, size, sweet, qty, unitPrice, note }]
 *   status: "Menunggu Pembayaran" | "Dibayar" | "Diproses" | "Dikirim" | "Siap Diambil" | "Selesai"
 */

export const PAYMENT_WINDOW_MS = 15 * 60 * 1000 // harus sama dengan batas waktu QR di PembayaranPage

// ---- Penyimpanan lokal ----
// Akun login  : matcha_orders_<email>
// Tamu        : matcha_orders_guest (tersimpan di browser/perangkat ini)
const keyOf = (user) => (user ? `matcha_orders_${user.email || user.id}` : 'matcha_orders_guest')

const readLocal = (user) => {
  try {
    const list = JSON.parse(localStorage.getItem(keyOf(user)))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}
const writeLocal = (user, list) => localStorage.setItem(keyOf(user), JSON.stringify(list))
const newestFirst = (list) => [...list].sort((a, b) => b.createdAt - a.createdAt)

/** Daftar pesanan, terbaru di atas. `user` kosong = pembeli tamu. */
export async function getOrders(user) {
  if (USE_MOCK) return newestFirst(readLocal(user))

  if (user) {
    const { data } = await api.get('/pesanan/saya')
    return data
  }

  // Tamu: tanya status terbaru ke server berdasarkan nomor pesanan yang tersimpan di perangkat
  const local = readLocal(null)
  if (local.length === 0) return []
  try {
    const { data } = await api.get('/pesanan/lacak', { params: { ids: local.map((o) => o.id).join(',') } })
    return data
  } catch {
    return newestFirst(local) // server tidak terjangkau: tampilkan catatan lokal
  }
}

/** Simpan pesanan baru ke riwayat (akun login maupun tamu). */
export function saveOrder(user, order) {
  // Mode API + login: sudah dibuat backend lewat POST /pesanan, tidak perlu salinan lokal
  if (!USE_MOCK && user) return
  writeLocal(user, [order, ...readLocal(user).filter((o) => o.id !== order.id)])
}

/** Ubah status pesanan. Mode API: status asli diisi backend (webhook / admin). */
export function updateOrderStatus(user, id, status) {
  if (!USE_MOCK && user) return
  writeLocal(user, readLocal(user).map((o) => (o.id === id ? { ...o, status } : o)))
}

/** Saat tamu login/daftar: pindahkan riwayat tamunya ke akun yang baru dipakai. */
export async function claimGuestOrders(user) {
  const guest = readLocal(null)
  if (!user || user.role !== 'konsumen' || guest.length === 0) return

  if (USE_MOCK) {
    const mine = readLocal(user)
    const merged = [...guest, ...mine.filter((m) => !guest.some((g) => g.id === m.id))]
    writeLocal(user, merged)
  } else {
    await api.post('/pesanan/klaim', { ids: guest.map((o) => o.id) })
  }
  localStorage.removeItem(keyOf(null))
}

/** Pesanan belum dibayar dan sudah lewat batas waktu -> tampil "Kedaluwarsa". */
export const displayStatus = (order) =>
  order.status === 'Menunggu Pembayaran' && Date.now() - order.createdAt > PAYMENT_WINDOW_MS
    ? 'Kedaluwarsa'
    : order.status
