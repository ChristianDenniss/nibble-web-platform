/**
 * RestaurantCard — store tile: cover, name, rating · ETA · starting price, providers.
 */
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
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
  const meta = [
    restaurant.rating.count > 0 ? restaurant.rating.average.toFixed(1) : null,
    etaMin != null && etaMax != null ? `${etaMin}–${etaMax} min` : null,
    startingCents != null ? `From ${formatMoney(startingCents, currency)}` : null,
  ].filter(Boolean)

  return (
    <Link to={paths.store(restaurant.id)} className="group flex flex-col">
      <div className="relative">
        <CoverBlock
          tone={coverTone(restaurant.id)}
          label={restaurant.name.slice(0, 1)}
          className="h-36 rounded-2xl transition-opacity group-hover:opacity-90"
        />
        {restaurant.rating.count > 0 && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-content">
            <Star size={12} className="text-status-warning" />
            {restaurant.rating.average.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 pt-2.5">
        <h3 className="text-[15px] font-semibold leading-tight text-content">{restaurant.name}</h3>
        {meta.length > 0 && (
          <p className="text-xs text-content-muted">{meta.join(' · ')}</p>
        )}
        {providers.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-0.5">
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
