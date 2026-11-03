import Decor, { authDecor } from '../../shared/components/Decor'

/** Latar bergelombang hijau untuk halaman login & daftar */
export default function AuthBackground({ variant = 'login' }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-matcha-50 to-matcha-200">
      {variant === 'login' ? (
        <>
          <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-56 w-full animate-drift">
            <path d="M0 140 C120 60 240 120 360 150 C480 180 560 90 800 130 L800 300 L0 300Z" fill="#84c030" opacity=".55" />
          </svg>
          <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-56 w-full animate-drift-slow">
            <path d="M0 200 C140 120 260 190 380 210 C520 232 640 160 800 190 L800 300 L0 300Z" fill="#37700d" />
          </svg>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 600" preserveAspectRatio="none" className="absolute left-0 top-0 h-full w-1/3 min-w-[220px] animate-fade-in">
            <path d="M0 0 H300 C330 120 220 200 250 330 C275 440 170 520 190 600 H0Z" fill="#285409" />
            <path d="M0 0 H200 C230 90 140 150 160 250 C180 340 90 420 110 600 H0Z" fill="#37700d" opacity=".6" />
          </svg>
          <svg viewBox="0 0 500 400" preserveAspectRatio="none" className="absolute bottom-0 right-0 h-2/5 w-1/2 animate-drift">
            <path d="M500 60 C400 70 330 150 250 230 C170 310 90 330 0 400 H500Z" fill="#84c030" opacity=".6" />
            <path d="M500 150 C420 170 360 230 300 300 C250 355 150 380 90 400 H500Z" fill="#64a51b" opacity=".7" />
          </svg>
        </>
      )}
      <Decor items={authDecor} />
    </div>
  )
}
