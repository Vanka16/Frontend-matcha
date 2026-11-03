const TONES = {
  latte: { liquid: '#6fb326', top: '#9fd24a', bg: '#d6ea9f' },
  choco: { liquid: '#7a5232', top: '#6fb326', bg: '#ecd9b8' },
  milk: { liquid: '#8ccb3e', top: '#e3f2bd', bg: '#cfe8a0' },
  berry: { liquid: '#e5708c', top: '#6fb326', bg: '#f8d9e0' },
}

/**
 * Gambar minuman. Kalau produk punya `src` (foto asli dari desain Figma),
 * foto itu yang dipakai. Kalau belum, tampil ilustrasi gelas matcha.
 */
export default function DrinkImage({ src, alt = '', tone = 'latte', className = '', rounded = true }) {
  const t = TONES[tone] || TONES.latte
  const radius = rounded ? 'rounded-xl' : ''

  if (src) {
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${radius} ${className}`} />
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${radius} ${className}`}
      style={{ background: t.bg }}
      role="img"
      aria-label={alt}
    >
      <svg viewBox="0 0 100 130" className="h-4/5 max-h-full">
        <rect x="46" y="2" width="5" height="40" rx="2.5" fill="#37700d" transform="rotate(8 48 22)" />
        <path d="M22 30h56l-6 92a6 6 0 0 1-6 5H34a6 6 0 0 1-6-5z" fill="#ffffff" opacity=".55" />
        <path d="M25 48h50l-4.4 72a5 5 0 0 1-5 4.6H34.4a5 5 0 0 1-5-4.6z" fill={t.liquid} />
        <path d="M25 48h50l-.8 12H25.8z" fill={t.top} />
        <rect x="34" y="70" width="13" height="13" rx="3" fill="#fff" opacity=".35" transform="rotate(-10 40 76)" />
        <rect x="52" y="86" width="12" height="12" rx="3" fill="#fff" opacity=".3" transform="rotate(12 58 92)" />
        <rect x="18" y="26" width="64" height="8" rx="4" fill="#285409" />
      </svg>
    </div>
  )
}
