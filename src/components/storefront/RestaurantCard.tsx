/**
 * RestaurantCard — DoorDash-style store tile: cover, name, rating, ETA, starting price, providers.
 */
import { Link } from 'react-router-dom'
import { Clock, Star } from 'lucide-react'
import CoverBlock from './CoverBlock'
import Pill from '@/components/pills/Pill'
import { coverTone } from '@/lib/coverTone'
import { formatMoney } from '@/lib/money'
import { paths } from '@/routing/paths'
import type { Provider, Restaurant } from '@/generated/data-model'

interface Props {
  restaurant: Restaurant
  startingCents?: number | null
  currency?: string
  etaMin?: number | null
  etaMax?: number | null
  providers?: Provider[]
}

export default function RestaurantCard({
  restaurant,
  startingCents,
  currency = 'CAD',
  etaMin,
  etaMax,
  providers = [],
}: Props) {
  return (
    <Link
      to={paths.store(restaurant.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:bg-surface-brand-hover"
    >
      <CoverBlock tone={coverTone(restaurant.id)} label={restaurant.name.slice(0, 1)} className="h-36 rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-content group-hover:text-accent">{restaurant.name}</h3>
          {restaurant.rating.count > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-content-secondary">
              <Star size={12} className="text-status-warning" />
              {restaurant.rating.average.toFixed(1)}
            </span>
          )}
        </div>
        <p className="flex items-center gap-2 text-xs text-content-muted">
          {etaMin != null && etaMax != null && (
            <>
              <Clock size={12} />
              {etaMin}–{etaMax} min
            </>
          )}
          {startingCents != null && (
            <>
              {etaMin != null && <span aria-hidden>·</span>}
              <span className="font-medium text-accent">From {formatMoney(startingCents, currency)}</span>
            </>
          )}
        </p>
        {providers.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {providers.map((provider) => (
              <Pill key={provider.id} bare>
                {provider.name}
              </Pill>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
