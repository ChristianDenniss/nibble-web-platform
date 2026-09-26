/**
 * CuisinePage — restaurants for one cuisine (e.g. sushi).
 */
import { useParams } from 'react-router-dom'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import { lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function CuisinePage() {
  const { cuisineSlug = '' } = useParams()
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cuisine unavailable" description={error ?? undefined} />

  const cuisine = data.cuisines.find((entry) => entry.slug === cuisineSlug)
  const restaurants = data.restaurants.filter((restaurant) => cuisine ? restaurant.cuisineIds.includes(cuisine.id) : false)

  if (!cuisine) {
    return <EmptyState title="Cuisine not found" description={`Nothing named “${cuisineSlug}”.`} />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: paths.home },
          { label: 'Cuisines', href: paths.cuisines },
          { label: cuisine.name },
        ]}
      />
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-content-muted">Cuisine</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-content">{cuisine.name}</h1>
        <p className="mt-1 text-sm text-content-secondary">{restaurants.length} nearby</p>
      </div>
      {restaurants.length === 0 ? (
        <EmptyState title={`No ${cuisine.name.toLowerCase()} nearby`} />
      ) : (
        <div className="grid grid-cols-1 gap-4 small:grid-cols-2 xl:grid-cols-3">
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
