/**
 * Elemen dekorasi bergerak (daun, kilau, gelembung, bola warna).
 * Semuanya hanya hiasan: tidak bisa diklik dan disembunyikan dari pembaca layar.
 */
const LEAF = 'M20.5 3.5c-7.6.2-13 3.7-14.4 9.6-.3 1.2-.2 2.3.1 3.3L3 19.6l1.4 1.2 3.3-3.1c1 .4 2.1.5 3.3.3 5.9-1.1 9.4-6.6 9.5-14.5z'
const STAR = 'M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12 6.6-.6 11.4-5.4 12-12z'

function Item({ it }) {
  const pos = { left: it.l, top: it.t, right: it.r, bottom: it.b }
  const anim = { animationDelay: `${it.d ?? 0}s`, ...(it.dur ? { animationDuration: `${it.dur}s` } : {}) }

  if (it.k === 'blob') {
    return (
      <span className="absolute" style={{ ...pos, width: it.s, height: it.s }}>
        <span
          className="block h-full w-full animate-blob rounded-full"
          style={{ background: it.c, opacity: it.o ?? 0.35, ...anim }}
        />
      </span>
    )
  }
  if (it.k === 'bubble') {
    return (
      <span className="absolute" style={{ ...pos, width: it.s, height: it.s }}>
        <span
          className="block h-full w-full animate-bubble rounded-full border-2"
          style={{ borderColor: it.c, ...anim }}
        />
      </span>
    )
  }
  if (it.k === 'sparkle') {
    return (
      <span className="absolute" style={{ ...pos, width: it.s, height: it.s }}>
        <svg viewBox="0 0 24 24" className="h-full w-full animate-twinkle" fill={it.c} style={anim}>
          <path d={STAR} />
        </svg>
      </span>
    )
  }
  // daun: 'sway' (melayang di tempat) atau 'fall' (jatuh pelan)
  return (
    <span className="absolute" style={{ ...pos, width: it.s, height: it.s, opacity: it.o ?? 1 }}>
      <span
        className={`block h-full w-full ${it.a === 'fall' ? 'animate-leaf-fall' : 'animate-leaf-sway'}`}
        style={{ '--r': `${it.r0 ?? 0}deg`, ...anim }}
      >
        <svg viewBox="0 0 24 24" className="h-full w-full" fill={it.c}>
          <path d={LEAF} />
          <path d="M5 19C9 14 13 10 18 6" stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  )
}

export default function Decor({ items, className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((it, i) => (
        <Item key={i} it={it} />
      ))}
    </div>
  )
}

const G = { dark: '#37700d', mid: '#64a51b', bright: '#84c030', light: '#addb5c' }

export const heroDecor = [
  { k: 'blob', l: '-4%', t: '8%', s: 220, c: G.light, o: 0.45 },
  { k: 'blob', r: '30%', b: '-6%', s: 160, c: G.bright, o: 0.3, d: 3 },
  { k: 'leaf', a: 'sway', l: '6%', t: '14%', s: 46, c: G.mid, r0: -25, d: 0 },
  { k: 'leaf', a: 'sway', l: '44%', t: '8%', s: 34, c: G.dark, r0: 40, d: 2, dur: 11 },
  { k: 'leaf', a: 'sway', r: '5%', t: '12%', s: 56, c: G.bright, r0: 15, d: 1, dur: 10 },
  { k: 'leaf', a: 'sway', l: '38%', b: '16%', s: 30, c: G.mid, r0: -60, d: 4 },
  { k: 'leaf', a: 'fall', l: '22%', t: '0%', s: 26, c: G.mid, r0: 10, d: 0, dur: 17 },
  { k: 'leaf', a: 'fall', l: '58%', t: '0%', s: 22, c: G.dark, r0: -30, d: 6, dur: 19 },
  { k: 'leaf', a: 'fall', l: '80%', t: '0%', s: 28, c: G.bright, r0: 50, d: 11, dur: 15 },
  { k: 'sparkle', l: '50%', t: '24%', s: 18, c: '#f5c542', d: 0.4 },
  { k: 'sparkle', r: '4%', t: '46%', s: 14, c: '#ffffff', d: 1.6 },
  { k: 'sparkle', l: '12%', b: '24%', s: 16, c: '#f5c542', d: 2.4 },
  { k: 'bubble', r: '36%', b: '26%', s: 14, c: G.mid, d: 0 },
  { k: 'bubble', r: '28%', b: '30%', s: 9, c: G.mid, d: 1.8 },
  { k: 'bubble', r: '24%', b: '24%', s: 12, c: G.dark, d: 3.2 },
]

export const sectionDecor = [
  { k: 'blob', l: '-3%', t: '-6%', s: 200, c: G.bright, o: 0.25 },
  { k: 'blob', r: '-3%', b: '-8%', s: 240, c: G.light, o: 0.4, d: 4 },
  { k: 'leaf', a: 'sway', l: '2%', t: '30%', s: 40, c: G.mid, r0: -20, d: 0.5 },
  { k: 'leaf', a: 'sway', r: '3%', t: '12%', s: 36, c: G.dark, r0: 30, d: 2, dur: 11 },
  { k: 'leaf', a: 'sway', r: '8%', b: '6%', s: 44, c: G.bright, r0: -40, d: 1 },
  { k: 'sparkle', l: '8%', b: '10%', s: 16, c: '#f5c542', d: 0.8 },
  { k: 'sparkle', r: '22%', t: '8%', s: 12, c: '#ffffff', d: 2 },
]

export const authDecor = [
  { k: 'blob', l: '-5%', t: '10%', s: 240, c: G.light, o: 0.4 },
  { k: 'blob', r: '-4%', t: '-6%', s: 200, c: G.bright, o: 0.28, d: 3 },
  { k: 'leaf', a: 'sway', l: '8%', t: '22%', s: 44, c: G.mid, r0: -30, d: 0 },
  { k: 'leaf', a: 'sway', r: '10%', t: '10%', s: 38, c: G.dark, r0: 25, d: 1.5, dur: 11 },
  { k: 'leaf', a: 'sway', r: '6%', b: '30%', s: 50, c: G.bright, r0: 10, d: 2.5 },
  { k: 'leaf', a: 'fall', l: '30%', t: '0%', s: 24, c: G.mid, r0: 0, d: 0, dur: 18 },
  { k: 'leaf', a: 'fall', l: '70%', t: '0%', s: 20, c: G.dark, r0: 40, d: 8, dur: 16 },
  { k: 'sparkle', l: '44%', t: '14%', s: 16, c: '#f5c542', d: 0.5 },
  { k: 'sparkle', r: '24%', b: '22%', s: 12, c: '#ffffff', d: 1.8 },
]

export const footerDecor = [
  { k: 'leaf', a: 'sway', r: '6%', t: '16%', s: 52, c: G.mid, r0: 20, d: 0, o: 0.35 },
  { k: 'leaf', a: 'sway', r: '16%', b: '10%', s: 34, c: G.bright, r0: -30, d: 2, o: 0.3 },
  { k: 'sparkle', r: '30%', t: '30%', s: 12, c: '#f5c542', d: 1 },
]
