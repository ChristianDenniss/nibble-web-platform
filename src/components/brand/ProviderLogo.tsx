/**
 * ProviderLogo — square app-icon tile for a delivery provider (Skip, DoorDash, Uber Eats, …).
 * Known providers resolve by id, then by name; anything else falls back to an initials tile.
 * Assets live in `public/images/providers/`. Lives in `components/brand/`.
 */
import type { Provider } from '@/generated/data-model'
import { cn } from '@/lib/utils'

interface Props {
  provider: Provider
  className?: string
}

interface Logo {
  src: string
  /** The asset is a bare glyph with no built-in margin, so the tile pads it. */
  inset?: boolean
}

const LOGOS: Record<string, Logo> = {
  skip: { src: '/images/providers/skip.png' },
  doordash: { src: '/images/providers/doordash.svg', inset: true },
  ubereats: { src: '/images/providers/ubereats.png' },
  instacart: { src: '/images/providers/instacart.png' },
  grubhub: { src: '/images/providers/grubhub.png' },
  fantuan: { src: '/images/providers/fantuan.png' },
}

const ALIASES: Record<string, string> = {
  skipthedishes: 'skip',
}

function logoFor(provider: Provider): Logo | undefined {
  for (const raw of [provider.id.replace(/^(prov|ch)_/, ''), provider.name]) {
    const key = raw.toLowerCase().replace(/[^a-z]/g, '')
    const logo = LOGOS[ALIASES[key] ?? key]
    if (logo) return logo
  }
  return undefined
}

export default function ProviderLogo({ provider, className }: Props) {
  const logo = logoFor(provider)
  const tile = 'inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md ring-1 ring-border'
  if (!logo) {
    return (
      <span title={provider.name} className={cn(tile, 'bg-surface-inset text-[10px] font-semibold text-content-secondary', className)}>
        {provider.name.slice(0, 2)}
      </span>
    )
  }
  return (
    <span title={provider.name} className={cn(tile, 'bg-white', logo.inset && 'p-1', className)}>
      <img src={logo.src} alt={provider.name} className="size-full object-contain" />
    </span>
  )
}
