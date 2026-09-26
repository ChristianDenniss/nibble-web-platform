/**
 * StorePage — single restaurant: cover, meta, provider availability, menu sections.
 */
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, MapPin, Star } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import Pill from '@/components/pills/Pill'
import TabButton from '@/components/buttons/TabButton'
import CoverBlock from '@/components/storefront/CoverBlock'
import MenuItemCard from '@/components/storefront/MenuItemCard'
import { coverTone } from '@/lib/coverTone'
import { itemsForRestaurant, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function StorePage() {
  const { storeId = '' } = useParams()
  const { loading, data, error } = useStorefront()
  const [section, setSection] = useState<string | null>(null)

  const restaurant = data?.restaurants.find((entry) => entry.id === storeId)
  const items = useMemo(() => (data ? itemsForRestaurant(data, storeId) : []), [data, storeId])
  const sections = useMemo(() => [...new Set(items.map((item) => item.section))], [items])
  const visible = section ? items.filter((item) => item.section === section) : items

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Store unavailable" description={error ?? undefined} />
  if (!restaurant) return <EmptyState title="Store not found" />

  const providers = restaurantProviders(data, restaurant.id)
  const cuisine = data.cuisines.find((entry) => restaurant.cuisineIds.includes(entry.id))
  const eta = restaurantEta(data, restaurant.id)

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: paths.home },
          { label: cuisine?.name ?? 'Store', href: cuisine ? paths.cuisine(cuisine.slug) : paths.home },
          { label: restaurant.name },
        ]}
      />
      <CoverBlock tone={coverTone(restaurant.id)} label={restaurant.name} className="h-48" />
      <div className="flex flex-col gap-3 small:flex-row small:items-end small:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">{restaurant.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-content-secondary">
            {restaurant.rating.count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="text-status-warning" />
                {restaurant.rating.average.toFixed(1)} ({restaurant.rating.count.toLocaleString()})
              </span>
            )}
            {eta && (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {eta.min}–{eta.max} min
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {restaurant.location.address}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {providers.map((provider) => (
            <Pill key={provider.id} accent>{provider.name}</Pill>
          ))}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        <TabButton active={section === null} onClick={() => setSection(null)}>All</TabButton>
        {sections.map((name) => (
          <TabButton key={name} active={section === name} onClick={() => setSection(name)} count={items.filter((item) => item.section === name).length}>
            {name}
          </TabButton>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
        {visible.map((item) => {
          const prices = data.offers.filter((offer) => offer.menuItemId === item.id).map((offer) => offer.price.amountCents)
          return (
            <MenuItemCard
              key={item.id}
              item={item}
              storeId={restaurant.id}
              priceCents={prices.length ? Math.min(...prices) : null}
            />
          )
        })}
      </div>
    </div>
  )
}
