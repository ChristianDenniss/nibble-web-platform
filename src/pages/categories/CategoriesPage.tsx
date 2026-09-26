/**
 * CategoriesPage — DoorDash-style category tile grid (Food, Grocery, Convenience, …).
 */
import { ShoppingBag } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import CategoryTile from '@/components/storefront/CategoryTile'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function CategoriesPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Categories unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Categories' }]} />
      <PageTitle icon={<ShoppingBag size={20} />} title="Categories" count={data.categories.length} />
      <p className="text-sm text-content-secondary">Browse by what you need — food, grocery, convenience, and more.</p>
      <div className="grid grid-cols-1 gap-4 small:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((category) => (
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
