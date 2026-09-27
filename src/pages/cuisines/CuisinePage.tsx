/**
 * CuisinePage — restaurants for one cuisine, with sibling cuisine chips.
 */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CuisineChips from '@/components/storefront/CuisineChips'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import { lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'
import { extractAxiosError } from '@/errors'
import type { Restaurant } from '@/generated/data-model'

interface RestaurantPage {
  data: Restaurant[]
  total: number
  totalPages: number
}

export default function CuisinePage() {
  const { cuisineSlug = '' } = useParams()
  const { loading, data, error } = useStorefront({ lightweight: true })
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantsLoading, setRestaurantsLoading] = useState(false)
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null)

  useEffect(() => {
    if (!cuisineSlug) return
    let cancelled = false
    setRestaurantsLoading(true)
    axios.get<RestaurantPage>('/api/v1/restaurants', { params: { cuisine: cuisineSlug, page: 1, pageSize: 100 } })
      .then((response) => { if (!cancelled) setRestaurants(response.data.data) })
      .catch((err: unknown) => { if (!cancelled) setRestaurantsError(extractAxiosError(err, 'restaurants failed to load')) })
      .finally(() => { if (!cancelled) setRestaurantsLoading(false) })
    return () => { cancelled = true }
  }, [cuisineSlug])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cuisine unavailable" description={error ?? undefined} />

  const cuisine = data.cuisines.find((entry) => entry.slug === cuisineSlug)
  if (!cuisine) {
    return <EmptyState title="Cuisine not found" description={`Nothing named “${cuisineSlug}”.`} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-content">{cuisine.name}</h1>
        <p className="mt-1 text-sm text-content-secondary">{restaurants.length} nearby</p>
      </div>
      <CuisineChips
        cuisines={data.cuisines}
        activeSlug={cuisine.slug}
        hrefFor={(slug) => paths.cuisine(slug)}
        className="sticky top-(--app-header-height) z-20 -mx-5 bg-page px-5 py-2"
      />
      {restaurantsLoading ? <PageLoader /> : restaurantsError ? (
        <EmptyState title="Restaurants unavailable" description={restaurantsError} />
      ) : restaurants.length === 0 ? (
        <EmptyState title={`No ${cuisine.name.toLowerCase()} nearby`} />
      ) : (
        <div className="grid grid-cols-1 gap-5 small:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
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
      )}
    </div>
  )
}
