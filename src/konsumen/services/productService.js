import api from '../../shared/services/api'

// Backend mengirim harga sebagai string (Decimal), frontend memakai number.
const toNumber = (value) => Number(value) || 0

// Warna ilustrasi bergiliran supaya kartu tetap enak dilihat saat foto asli belum ada.
const TONES = ['latte', 'choco', 'milk', 'berry']

// Seed backend memakai URL contoh yang tidak bisa dibuka browser.
const isPlaceholderImage = (url) => {
  if (!url) return true
  try {
    const { hostname } = new URL(url)
    return hostname === 'example.com' || hostname.endsWith('.example.com')
  } catch {
    return true
  }
}

/** Ubah bentuk produk dari backend menjadi bentuk yang dipakai komponen frontend. */
export const normalizeProduct = (product, index = 0) => {
  const variants = (product.variants || []).map((variant) => ({
    id: variant.id,
    name: variant.variantName,
    additionalPrice: toNumber(variant.additionalPrice),
    stock: variant.stock ?? 0,
  }))

  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    basePrice: toNumber(product.basePrice),
    price: toNumber(product.basePrice),
    image: isPlaceholderImage(product.imageUrl) ? null : product.imageUrl,
    tone: TONES[index % TONES.length],
    tag: variants.length > 1 ? `${variants.length} varian` : 'Tersedia',
    variants,
  }
}

/** GET /api/products -> daftar produk aktif yang sudah dinormalisasi. */
export async function getProducts() {
  const { data } = await api.get('/products')
  const list = Array.isArray(data?.data) ? data.data : []
  return list
    .filter((product) => product.isActive !== false)
    .map((product, index) => normalizeProduct(product, index))
}
