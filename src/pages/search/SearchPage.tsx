/**
 * SearchPage — query results for restaurants and dishes, with a jump to filters.
 */
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import MenuItemCard from '@/components/storefront/MenuItemCard'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import SectionHeader from '@/components/storefront/SectionHeader'
import { lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const categorySlug = params.get('category')
  const { loading, data, error } = useStorefront()

  const matches = useMemo(() => {
    if (!data) return { restaurants: [], items: [] }
    const categoryId = data.categories.find((entry) => entry.slug === categorySlug)?.id
    const cuisineName = (id: string) => data.cuisines.find((entry) => entry.id === id)?.name ?? ''
    const restaurants = data.restaurants.filter((restaurant) => {
      const hay = `${restaurant.name} ${restaurant.cuisineIds.map(cuisineName).join(' ')}`.toLowerCase()
      const textOk = !q || hay.includes(q)
      const catOk = !categorySlug || (categoryId != null && restaurant.categoryIds.includes(categoryId))
      return textOk && catOk
    })
    const items = data.items.filter((item) => {
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false
      if (!categorySlug) return true
      const restaurant = data.restaurants.find((entry) => entry.id === item.restaurantId)
      return categoryId != null && (restaurant?.categoryIds.includes(categoryId) ?? false)
    })
    return { restaurants, items }
  }, [data, q, categorySlug])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Search is unavailable" description={error ?? undefined} />

  const heading = q ? `Results for “${q}”` : categorySlug ? `Category · ${categorySlug}` : 'Search'

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: heading }]} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">{heading}</h1>
          <p className="mt-1 text-sm text-content-secondary">
            {matches.restaurants.length} restaurants · {matches.items.length} dishes
          </p>
        </div>
        <Link
          to={paths.filters}
          className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-surface-inset px-4 text-sm font-medium text-content-secondary hover:bg-surface-raised"
        >
          <SlidersHorizontal size={14} />
          Filters
        </Link>
      </div>

      <section>
        <SectionHeader title="Restaurants" />
        {matches.restaurants.length === 0 ? (
          <EmptyState title="No restaurants match" description="Try another search or clear filters." />
        ) : (
          <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
            {matches.restaurants.map((restaurant) => (
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
      </section>

      <section>
        <SectionHeader title="Dishes" />
        {matches.items.length === 0 ? (
          <EmptyState title="No dishes match" />
        ) : (
          <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
            {matches.items.map((item) => {
              const price = data.offers
                .filter((offer) => offer.menuItemId === item.id)
                .map((offer) => offer.price.amountCents)
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  storeId={item.restaurantId}
                  priceCents={price.length ? Math.min(...price) : null}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
