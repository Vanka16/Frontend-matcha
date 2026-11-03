// Mengambil foto dari src/assets/images berdasarkan nama file (tanpa ekstensi).
// Kalau filenya belum ada, hasilnya null sehingga tampilan sementara dipakai.
const files = import.meta.glob('../../assets/images/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default',
})

const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop().replace(/\.[^.]+$/, ''), url]),
)

export const getImage = (name) => byName[name] || null
