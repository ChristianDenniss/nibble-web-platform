/**
 * HomePage — craving hero, then Skip/DoorDash-style browse rails and nearby restaurants.
 */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AppLogo from '@/components/brand/AppLogo'
import LocationSelector from '@/components/location/LocationSelector'
import PageLoader from '@/components/layout/PageLoader'
import EmptyState from '@/components/misc/EmptyState'
import SearchBar from '@/components/navigation/SearchBar'
import BrowseScroller from '@/components/storefront/BrowseScroller'
import CategoryTile from '@/components/storefront/CategoryTile'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import SectionHeader from '@/components/storefront/SectionHeader'
import { selectDeliveryAddress } from '@/hooks/location/deliveryLocationStore'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import {
  currentAddress,
  lowestOfferCents,
  restaurantEta,
  restaurantProviders,
  useStorefront,
} from '@/hooks/storefront/useStorefront'
import { paths, searchPath } from '@/routing/paths'

export default function HomePage() {
  const { loading, data, error } = useStorefront()
  const { locating, locate } = useDeviceLocation()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  if (loading) return <PageLoader />
  if (!data) {
    return <EmptyState title="Nothing to browse yet" description={error ?? 'Storefront catalog is empty.'} />
  }

  const address = currentAddress(data)
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(searchPath(query))
  }

  return (
    <div className="space-y-10">
      <section className="relative isolate flex flex-col items-center overflow-hidden py-8 text-center small:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <span className="food-doodle food-doodle--pizza">🍕</span>
          <span className="food-doodle food-doodle--burger">🍔</span>
          <span className="food-doodle food-doodle--taco">🌮</span>
          <span className="food-doodle food-doodle--fries">🍟</span>
          <span className="food-doodle food-doodle--noodles">🍜</span>
          <span className="food-doodle food-doodle--avocado">🥑</span>
        </div>

        <div className="relative z-10 flex w-full flex-col items-center">
          <AppLogo className="mb-6 h-24 w-auto small:h-32" />
          <LocationSelector
            addresses={data.account.addresses}
            selected={address}
            onSelect={(next) => selectDeliveryAddress(next.id)}
            onUseCurrentLocation={() => locate(data.account.addresses)}
            locating={locating}
            variant="hero"
            placeholder="Add your delivery location"
            className="mb-8"
          />

          <p className="mb-3 text-sm font-medium text-accent">Good food, zero overthinking.</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-content small:text-6xl">
            What are you <span className="text-accent">craving?</span>
          </h1>
          <p className="mt-4 text-base text-content-secondary">Say the word. We’ll find your next bite.</p>

          <form onSubmit={search} className="mt-8 flex w-full max-w-xl gap-2">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Tacos, noodles, something crispy..."
              size="lg"
              className="min-w-0 flex-1"
            />
            <button
              type="submit"
              aria-label="Search food"
              className="inline-flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {data.categories.length > 0 && (
        <BrowseScroller title="Categories" to={paths.categories}>
          {data.categories.map((category) => (
            <CategoryTile
              key={category.id}
              item={category}
              to={searchPath(undefined, { category: category.slug })}
              className="w-24 shrink-0 snap-start"
            />
          ))}
        </BrowseScroller>
      )}

      {data.cuisines.length > 0 && (
        <BrowseScroller title="Cuisines" to={paths.cuisines}>
          {data.cuisines.map((cuisine) => (
            <CategoryTile
              key={cuisine.id}
              item={cuisine}
              to={paths.cuisine(cuisine.slug)}
              className="w-24 shrink-0 snap-start"
            />
          ))}
        </BrowseScroller>
      )}

      <section>
        <SectionHeader title="Nearby" />
        <div className="grid grid-cols-1 gap-5 small:grid-cols-2 xl:grid-cols-3">
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
      </section>
    </div>
  )
}
