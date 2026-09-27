/**
 * RestaurantCard — store tile: cover, name, rating · ETA · starting price, and the order-path icon stack.
 * Sponsored tiles carry a visible "Sponsored" tag and report impressions/clicks.
 */
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import CoverBlock from './CoverBlock'
import OrderPathStack from './OrderPathStack'
import { useSponsoredTracking } from '@/hooks/home/useSponsoredEvents'
import { cn } from '@/lib/utils'
import { coverTone } from '@/lib/coverTone'
import { formatMoney } from '@/lib/money'
import type { CoverageStatus } from '@/lib/restaurantAvailability'
import { paths } from '@/routing/paths'
import type { Provider, Restaurant, SponsoredMark } from '@/generated/data-model'

interface Props {
  restaurant: Restaurant
  startingCents?: number | null
  currency?: string
  etaMin?: number | null
  etaMax?: number | null
  providers?: Provider[]
  providerStatus?: Record<string, 'covered' | 'unavailable' | 'unknown'>
  sponsored?: SponsoredMark | null
  reason?: string
  distanceKm?: number | null
  coverage?: CoverageStatus
  surface?: string
  className?: string
}

export default function RestaurantCard({
  restaurant,
  startingCents,
  currency = 'CAD',
  etaMin,
  etaMax,
  providers = [],
  providerStatus,
  sponsored = null,
  reason,
  distanceKm,
  coverage = 'unknown',
  surface = 'home',
  className,
}: Props) {
  const tracking = useSponsoredTracking<HTMLDivElement>(sponsored, surface)
  const meta = [
    restaurant.rating.count > 0 ? restaurant.rating.average.toFixed(1) : null,
    etaMin != null && etaMax != null ? `${etaMin}–${etaMax} min` : null,
    distanceKm != null ? `${distanceKm.toFixed(1)} km away` : null,
    startingCents != null ? `From ${formatMoney(startingCents, currency)}` : null,
  ].filter(Boolean)

  return (
    <div
      ref={tracking.ref}
      className={cn(
        'group relative flex flex-col',
        coverage === 'unavailable' && 'opacity-60 grayscale',
        className,
      )}
    >
      <div className="relative">
        <CoverBlock
          tone={coverTone(restaurant.id)}
          label={restaurant.name.slice(0, 1)}
          className="h-36 rounded-2xl transition-opacity group-hover:opacity-90"
        />
        {sponsored && (
          <span className="absolute right-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-medium text-content-secondary">
            {sponsored.label || 'Sponsored'}
          </span>
        )}
        {restaurant.rating.count > 0 && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-content">
            <Star size={12} className="text-status-warning" />
            {restaurant.rating.average.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 pt-2.5">
        <h3 className="text-[15px] font-semibold leading-tight text-content">
          {/* Stretched link: its ::after covers the whole card, so only the order-path row sits outside it. */}
          <Link
            to={paths.store(restaurant.id)}
            onClick={tracking.onClick}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand"
          >
            {restaurant.name}
          </Link>
        </h3>
        {meta.length > 0 && (
          <p className="text-xs text-content-muted">{meta.join(' · ')}</p>
        )}
        {reason && <p className="text-xs font-medium text-accent">{reason}</p>}
        <OrderPathStack restaurant={restaurant} providers={providers} providerStatus={providerStatus} className="relative z-10 mt-auto self-start pt-0.5" />
      </div>
    </div>
  )
}
