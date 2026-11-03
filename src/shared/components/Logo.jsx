export function LeafIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5c-7.6.2-13 3.7-14.4 9.6-.3 1.2-.2 2.3.1 3.3L3 19.6l1.4 1.2 3.3-3.1c1 .4 2.1.5 3.3.3 5.9-1.1 9.4-6.6 9.5-14.5z" />
    </svg>
  )
}

/** Logo "Matcha and Me" */
export default function Logo({ light = false, className = '' }) {
  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <span
        className={`transition-transform duration-300 group-hover:animate-wiggle ${
          light ? 'text-white' : 'text-matcha-700'
        }`}
      >
        <LeafIcon className="h-6 w-6 origin-bottom-left animate-leaf-sway [--r:0deg] [animation-duration:6s]" />
      </span>
      <div className="whitespace-nowrap text-lg font-extrabold leading-none">
        <span className={light ? 'text-white' : 'text-matcha-900'}>Matcha</span>{' '}
        <span className={`font-semibold italic ${light ? 'text-matcha-200' : 'text-matcha-600'}`}>and</span>{' '}
        <span className={light ? 'text-white' : 'text-matcha-900'}>Me</span>
      </div>
    </div>
  )
}
