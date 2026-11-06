const TONES = {
  green: 'bg-matcha-700 text-white',
  amber: 'bg-amber-600 text-white',
  red: 'bg-red-600 text-white',
}

const MAP = {
  Aktif: 'green',
  Aman: 'green',
  Dibayar: 'green',
  Selesai: 'green',
  Dikirim: 'amber',
  'Siap Diambil': 'amber',
  Diproses: 'amber',
  Menunggu: 'amber',
  Menipis: 'amber',
  'Menunggu Pembayaran': 'amber',
  Kedaluwarsa: 'red',
  Dibatalkan: 'red',
  Gagal: 'red',
  Refund: 'red',
  Habis: 'red',
}

export default function StatusBadge({ status }) {
  const tone = TONES[MAP[status] || 'green']
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
      {status}
    </span>
  )
}
