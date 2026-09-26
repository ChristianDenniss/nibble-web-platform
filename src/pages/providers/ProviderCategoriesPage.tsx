/**
 * ProviderCategoriesPage — categories as they appear for one provider (Skip / DoorDash).
 */
import { useParams } from 'react-router-dom'
import { Store } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import CategoryTile from '@/components/storefront/CategoryTile'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

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

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: provider.name }]} />
      <PageTitle icon={<Store size={20} />} title={`${provider.name} categories`} count={categories.length} />
      <p className="text-sm text-content-secondary">
        These are the browse groups we currently see offers for on {provider.name}.
      </p>
      <div className="grid grid-cols-1 gap-4 small:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            to={`${paths.search}?category=${category.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
