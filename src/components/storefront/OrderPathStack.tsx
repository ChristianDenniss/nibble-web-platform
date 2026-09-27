/**
 * OrderPathStack — every way to order from a restaurant as one overlapping row of icon tiles:
 * provider logos, then (after a divider) its own app and call-in ordering.
 * Tiles overlap to save space and spread apart on hover, focus, or while a popover is open (touch has no hover).
 * Clicking a tile opens a small popover naming that path; direct paths include the action (open app / call).
 * Must not render inside a link: the tiles are buttons and the popover can hold links.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Globe, Phone } from 'lucide-react'
import ProviderLogo from '@/components/brand/ProviderLogo'
import type { Provider, Restaurant } from '@/generated/data-model'
import { cn } from '@/lib/utils'

interface Props {
  restaurant: Restaurant
  providers: Provider[]
  providerStatus?: Record<string, 'covered' | 'unavailable' | 'unknown'>
  size?: 'sm' | 'md'
  className?: string
}

type OrderPath =
  | { key: string; kind: 'provider'; provider: Provider; status?: 'covered' | 'unavailable' | 'unknown' }
  | { key: 'app'; kind: 'app'; url: string }
  | { key: 'phone'; kind: 'phone'; phone: string }

const SIZES = {
  sm: {
    tile: 'size-6 rounded-md',
    badgeTile: 'size-5 rounded-md',
    overlap: '-ml-1.5 group-hover/paths:ml-1 group-focus-within/paths:ml-1 group-data-[open=true]/paths:ml-1',
    divider: 'mx-1.5 h-4',
    popover: 'left-0',
  },
  md: {
    tile: 'size-8 rounded-lg',
    badgeTile: 'size-5 rounded-md',
    overlap: '-ml-3 group-hover/paths:ml-1.5 group-focus-within/paths:ml-1.5 group-data-[open=true]/paths:ml-1.5',
    divider: 'mx-2 h-5',
    popover: 'left-0 small:left-auto small:right-0',
  },
} as const


export default function OrderPathStack({ restaurant, providers, providerStatus, size = 'sm', className }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const s = SIZES[size]

  useEffect(() => {
    if (!openKey) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpenKey(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenKey(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openKey])

  const providerPaths: OrderPath[] = providers.map((provider) => ({ key: provider.id, kind: 'provider', provider, status: providerStatus?.[provider.id] }))
  const directPaths: OrderPath[] = [
    ...(restaurant.appURL ? [{ key: 'app', kind: 'app', url: restaurant.appURL } as const] : []),
    ...(restaurant.phone ? [{ key: 'phone', kind: 'phone', phone: restaurant.phone } as const] : []),
  ]
  if (providerPaths.length === 0 && directPaths.length === 0) return null

  const open = [...providerPaths, ...directPaths].find((path) => path.key === openKey) ?? null

  const renderGroup = (paths: OrderPath[]) =>
    paths.map((path, index) => (
      <button
        key={path.key}
        type="button"
        aria-label={labelFor(path, restaurant.name)}
        aria-expanded={openKey === path.key}
        onClick={() => setOpenKey((current) => (current === path.key ? null : path.key))}
        // Earlier tiles sit on top so each logo's leading edge stays visible; hover/open lifts above all of them.
        style={{ '--stack-z': paths.length - index } as CSSProperties}
        className={cn(
          'relative z-(--stack-z) shrink-0 cursor-pointer ring-2 ring-page transition-[margin,transform] duration-200 ease-out hover:z-20 hover:-translate-y-0.5 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-brand',
          s.tile,
          index > 0 && s.overlap,
          path.kind === 'provider' && path.status && path.status !== 'covered' && 'opacity-45 grayscale',
          openKey === path.key && 'z-20 -translate-y-0.5 ring-brand',
        )}
      >
        <PathTile path={path} className={s.tile} />
      </button>
    ))

  return (
    <div ref={root} data-open={openKey !== null} className={cn('group/paths relative inline-flex items-center', className)}>
      {renderGroup(providerPaths)}
      {providerPaths.length > 0 && directPaths.length > 0 && (
        <span aria-hidden="true" className={cn('w-px shrink-0 bg-border', s.divider)} />
      )}
      {renderGroup(directPaths)}

      {open && (
        <div
          role="status"
          className={cn(
            'absolute bottom-full z-30 mb-2 w-max max-w-64 rounded-xl border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg',
            s.popover,
          )}
        >
          <PathDetails path={open} restaurantName={restaurant.name} badgeTile={s.badgeTile} />
        </div>
      )}
    </div>
  )
}

function labelFor(path: OrderPath, restaurantName: string): string {
  if (path.kind === 'provider') return path.status && path.status !== 'covered'
    ? `${providerDisplayName(path.provider)} coverage unavailable or unconfirmed`
    : `Available on ${providerDisplayName(path.provider)}`
  if (path.kind === 'app') return `${restaurantName} restaurant ordering website or app`
  return `${restaurantName} takes phone orders`
}

function providerDisplayName(provider: Provider): string {
  return provider.name === 'Skip' ? 'SkipTheDishes' : provider.name
}

function PathTile({ path, className }: { path: OrderPath; className?: string }) {
  if (path.kind === 'provider') return <ProviderLogo provider={path.provider} className={className} />
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center bg-white p-1 ring-1 ring-border', className)}>
      {path.kind === 'app' ? (
        <Globe className="size-full text-content-secondary" aria-hidden="true" />
      ) : (
        <Phone className="size-full text-content-secondary" strokeWidth={2.25} aria-hidden="true" />
      )}
    </span>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-inset py-0.5 pl-0.5 pr-2.5 font-semibold text-content">
      {children}
    </span>
  )
}

function PathDetails({ path, restaurantName, badgeTile }: { path: OrderPath; restaurantName: string; badgeTile: string }) {
  const tile = <PathTile path={path} className={cn(badgeTile, path.kind !== 'provider' && 'p-0.5')} />
  const action = 'font-semibold text-accent hover:underline'

  if (path.kind === 'provider') {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-content-secondary">
          {path.status === 'unavailable'
            ? 'This provider is out of range for the selected address.'
            : path.status === 'unknown'
              ? 'Coverage for this provider is not confirmed for the selected address.'
              : 'This restaurant is covered by'}
        </p>
        <Badge>
          {tile}
          {providerDisplayName(path.provider)}
        </Badge>
      </div>
    )
  }
  if (path.kind === 'app') {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-content-secondary">Open the restaurant’s ordering website or app; confirm the location and fulfillment options.</p>
        <Badge>
          {tile}
          {restaurantName}
        </Badge>
        <a href={path.url} target="_blank" rel="noopener noreferrer" className={action}>
          Open restaurant ordering
        </a>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-content-secondary">This restaurant takes orders by phone</p>
      <Badge>
        {tile}
        {path.phone}
      </Badge>
      <a href={`tel:${path.phone.replace(/[^\d+]/g, '')}`} className={action}>
        Call to order
      </a>
    </div>
  )
}
