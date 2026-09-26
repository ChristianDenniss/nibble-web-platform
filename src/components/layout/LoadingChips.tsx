/**
 * LoadingChips — loading skeleton for a row of pill-shaped chips: N small rounded-full pulsing placeholders.
 * Props: `count?` (default 3) controls how many chip placeholders render; `size?` (`sm` | `md`, default `sm`) matches `ResourcePill` sizing.
 * Lives in `components/layout/`; use while a tag/chip list is still loading.
 */
interface Props {
  count?: number
  size?: 'sm' | 'md'
}

const SIZE_CLASS = {
  sm: 'h-5 w-28',
  md: 'h-8 w-36',
}

export default function LoadingChips({ count = 3, size = 'sm' }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${SIZE_CLASS[size]} rounded-full bg-surface-elevated animate-pulse`} />
      ))}
    </>
  )
}
