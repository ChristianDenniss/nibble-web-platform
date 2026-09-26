/**
 * SearchPage — query results for restaurants and dishes, with a jump to filters.
 * Category landings add cuisine chips and lead with the restaurant feed.
 */
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CuisineChips from '@/components/storefront/CuisineChips'
import MenuItemCard from '@/components/storefront/MenuItemCard'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import SectionHeader from '@/components/storefront/SectionHeader'
import { lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths, searchPath } from '@/routing/paths'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const categorySlug = params.get('category')
  const cuisineSlug = params.get('cuisine')
  const { loading, data, error } = useStorefront()

  const matches = useMemo(() => {
    if (!data) return { restaurants: [], items: [] }
    const categoryId = data.categories.find((entry) => entry.slug === categorySlug)?.id
    const cuisineId = data.cuisines.find((entry) => entry.slug === cuisineSlug)?.id
    const cuisineName = (id: string) => data.cuisines.find((entry) => entry.id === id)?.name ?? ''
    const restaurants = data.restaurants.filter((restaurant) => {
      const hay = `${restaurant.name} ${restaurant.cuisineIds.map(cuisineName).join(' ')}`.toLowerCase()
      const textOk = !q || hay.includes(q)
      const catOk = !categorySlug || (categoryId != null && restaurant.categoryIds.includes(categoryId))
      const cuisineOk = !cuisineSlug || (cuisineId != null && restaurant.cuisineIds.includes(cuisineId))
      return textOk && catOk && cuisineOk
    })
    const items = data.items.filter((item) => {
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false
      const restaurant = data.restaurants.find((entry) => entry.id === item.restaurantId)
      if (categorySlug && (categoryId == null || !restaurant?.categoryIds.includes(categoryId))) return false
      if (cuisineSlug && (cuisineId == null || !restaurant?.cuisineIds.includes(cuisineId))) return false
      return true
    })
    return { restaurants, items }
  }, [data, q, categorySlug, cuisineSlug])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Search is unavailable" description={error ?? undefined} />

  const category = data.categories.find((entry) => entry.slug === categorySlug)
  const cuisine = data.cuisines.find((entry) => entry.slug === cuisineSlug)
  const heading = q
    ? `Results for “${q}”`
    : category
      ? category.name
      : 'Search'
  const categoryBrowse = Boolean(categorySlug && !q)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">{heading}</h1>
          <p className="mt-1 text-sm text-content-secondary">
            {matches.restaurants.length} restaurants
            {!categoryBrowse && ` · ${matches.items.length} dishes`}
            {cuisine && ` · ${cuisine.name}`}
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

      {categorySlug && (
        <CuisineChips
          cuisines={data.cuisines}
          activeSlug={cuisineSlug}
          allHref={searchPath(q || undefined, { category: categorySlug })}
          hrefFor={(slug) => searchPath(q || undefined, {
            category: categorySlug,
            cuisine: slug === cuisineSlug ? undefined : slug,
          })}
          className="sticky top-16 z-20 -mx-5 bg-page px-5 py-2"
        />
      )}

      <section>
        <SectionHeader title="Restaurants" />
        {matches.restaurants.length === 0 ? (
          <EmptyState title="No restaurants match" description="Try another search or clear filters." />
        ) : (
          <div className="grid grid-cols-1 gap-5 small:grid-cols-2">
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
