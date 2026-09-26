/**
 * HomePage — landing / browse: category strip, cuisine row, nearby restaurants.
 */
import { Link } from 'react-router-dom'
import { MapPin, SlidersHorizontal, UtensilsCrossed } from 'lucide-react'
import PageLoader from '@/components/layout/PageLoader'
import EmptyState from '@/components/misc/EmptyState'
import CategoryTile from '@/components/storefront/CategoryTile'
import CoverBlock from '@/components/storefront/CoverBlock'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import SectionHeader from '@/components/storefront/SectionHeader'
import { coverTone } from '@/lib/coverTone'
import { currentAddress, lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function HomePage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) {
    return <EmptyState title="Nothing to browse yet" description={error ?? 'Storefront catalog is empty.'} />
  }

  const address = currentAddress(data)

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-brand/10 px-5 py-6 small:flex-row small:items-center small:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">Nearby</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-content">
            What are you craving?
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-content-secondary">
            <MapPin size={14} className="text-accent" />
            {address ? `${address.location.address}, ${address.location.city}` : 'Set a delivery address'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={paths.location}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-border bg-surface-inset px-4 text-sm font-medium text-content-secondary hover:bg-surface-raised"
          >
            Change address
          </Link>
          <Link
            to={paths.filters}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-border bg-surface-inset px-4 text-sm font-medium text-content-secondary hover:bg-surface-raised"
          >
            <SlidersHorizontal size={14} />
            Filters
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader title="Categories" to={paths.categories} />
        <div className="grid grid-cols-2 gap-3 small:grid-cols-4">
          {data.categories.slice(0, 4).map((category) => (
            <CategoryTile key={category.id} category={category} to={`${paths.search}?category=${category.slug}`} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Cuisines" to={paths.cuisines} />
        <div className="flex gap-3 overflow-x-auto pb-1">
          {data.cuisines.map((cuisine) => (
            <Link key={cuisine.id} to={paths.cuisine(cuisine.slug)} className="w-28 shrink-0">
              <CoverBlock tone={coverTone(cuisine.id)} label={cuisine.name.slice(0, 1)} className="h-20" />
              <p className="mt-2 text-center text-sm font-medium text-content">{cuisine.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Nearby restaurants" />
        <div className="grid grid-cols-1 gap-4 small:grid-cols-2 xl:grid-cols-3">
          {data.restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              startingCents={lowestOfferCents(data, restaurant.id)}
              etaMin={restaurantEta(data, restaurant.id)?.min}
              etaMax={restaurantEta(data, restaurant.id)?.max}
              providers={restaurantProviders(data, restaurant.id)}
            />
          ))}
        </div>
        {data.restaurants.length === 0 && (
          <EmptyState icon={<UtensilsCrossed className="text-content-muted" />} title="No restaurants nearby" />
        )}
      </section>
    </div>
  )
}
