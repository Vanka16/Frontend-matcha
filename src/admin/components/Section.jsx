/** Judul bagian (judul + deskripsi + tombol aksi di kanan) */
export default function Section({ title, desc, action, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-matcha-900">{title}</h2>
        {desc && <p className="text-xs text-stone-500">{desc}</p>}
      </div>
      {action}
      {children}
    </div>
  )
}
