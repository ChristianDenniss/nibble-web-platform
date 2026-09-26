/**
 * AppLogo — a small rounded brand mark used in the header logo slot.
 * Filled with the brand-hue scale so it tracks theme tokens; one of the few places allowed
 * to reference raw `var(--brand-*)` values.
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
        fill="var(--brand-500)"
      />
      <path
        d="M8 20V12h6.5c2.4 0 4 1.4 4 3.5S16.9 19 14.5 19H11v1H8zm3-4.2h3c.9 0 1.5-.5 1.5-1.3s-.6-1.3-1.5-1.3H11v2.6z"
        fill="var(--on-brand)"
      />
    </svg>
  )
}
