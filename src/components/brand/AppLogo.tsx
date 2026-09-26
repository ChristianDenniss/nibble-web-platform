/**
 * AppLogo — Nibble brand mark. `mark="n"` is the compact N for nav bars;
 * the default is the full wordmark (N with speed lines) for heroes and empty states.
 * Assets live in `public/images/`. Lives in `components/brand/`.
 */
interface Props {
  className?: string
  mark?: 'wordmark' | 'n'
}

const MARKS = {
  wordmark: '/images/LogoNoBG.png',
  n: '/images/LogoJustN.png',
} as const

export default function AppLogo({ className = '', mark = 'wordmark' }: Props) {
  return (
    <img
      src={MARKS[mark]}
      alt=""
      className={className}
      aria-hidden="true"
    />
  )
}
