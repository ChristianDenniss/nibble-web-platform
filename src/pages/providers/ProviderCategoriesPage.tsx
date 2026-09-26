/**
 * ProviderCategoriesPage — categories as they appear for one provider (Skip / DoorDash).
 */
import { useParams } from 'react-router-dom'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CategoryTile from '@/components/storefront/CategoryTile'
import { isFeaturedCategory } from '@/lib/browseIcons'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { searchPath } from '@/routing/paths'

export default function ProviderCategoriesPage() {
  const { providerId = '' } = useParams()
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Provider unavailable" description={error ?? undefined} />

  const provider = data.providers.find((entry) => entry.id === providerId)
  if (!provider) return <EmptyState title="Provider not found" />

  const restaurantIds = new Set(
    data.offers.filter((offer) => offer.providerId === provider.id).map((offer) => offer.restaurantId),
  )
  const categoryIds = new Set(
    data.restaurants
      .filter((restaurant) => restaurantIds.has(restaurant.id))
      .flatMap((restaurant) => restaurant.categoryIds),
  )
  const categories = data.categories.filter((category) => categoryIds.has(category.id))
  const featured = categories.filter((category) => isFeaturedCategory(category.slug))
  const rest = categories.filter((category) => !isFeaturedCategory(category.slug))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-content">{provider.name}</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Browse groups we currently see offers for on {provider.name}.
        </p>
      </div>

      {featured.length > 0 && (
        <div className="grid grid-cols-1 gap-4 small:grid-cols-3">
          {featured.map((category) => (
            <CategoryTile
              key={category.id}
              item={category}
              to={searchPath(undefined, { category: category.slug })}
              variant="featured"
            />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-4 gap-3 small:grid-cols-6">
          {rest.map((category) => (
            <CategoryTile
              key={category.id}
              item={category}
              to={searchPath(undefined, { category: category.slug })}
            />
          ))}
        </div>
      )}

      {categories.length === 0 && (
        <EmptyState title="No categories yet" description={`Nothing listed for ${provider.name} right now.`} />
      )}
    </div>
  )
}
