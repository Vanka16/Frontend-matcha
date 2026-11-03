const NOTE_TONES = {
  up: 'text-matcha-600',
  warn: 'text-amber-600',
  muted: 'text-stone-400',
}

/** Kartu angka ringkas di bagian atas halaman admin */
export default function StatCard({ label, value, note, tone = 'up', icon = 'bi-circle-fill' }) {
  return (
    <div className="card-soft h-100 p-4">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-matcha-100 text-[9px] text-matcha-700">
          <i className={`bi ${icon}`} />
        </span>
        {label}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-xl font-extrabold leading-tight text-matcha-900">{value}</div>
        {note && <div className={`pb-0.5 text-xs font-semibold ${NOTE_TONES[tone]}`}>{note}</div>}
      </div>
    </div>
  )
}
