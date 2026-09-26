/**
 * AppLogo — Nibble mark: soft-pink tile, raspberry N.
 * Lives in `components/brand/`; composed by Header.
 */
interface Props {
  className?: string
}

export default function AppLogo({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="8"
        fill="var(--brand-300)"
      />
      <path
        d="M10 22V10h3.1l5.5 8.1V10H22v12h-3.1l-5.5-8.1V22H10z"
        fill="var(--brand-500)"
      />
    </svg>
  )
}
