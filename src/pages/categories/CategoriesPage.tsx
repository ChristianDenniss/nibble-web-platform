/**
 * CategoriesPage — featured department tiles, compact icon grid, then cuisines.
 */
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CategoryTile from '@/components/storefront/CategoryTile'
import SectionHeader from '@/components/storefront/SectionHeader'
import { isFeaturedCategory } from '@/lib/browseIcons'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths, searchPath } from '@/routing/paths'

export default function CategoriesPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Categories unavailable" description={error ?? undefined} />

  const featured = data.categories.filter((category) => isFeaturedCategory(category.slug))
  const rest = data.categories.filter((category) => !isFeaturedCategory(category.slug))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-content">Browse</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Food, grocery, and whatever else you’re after.
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
        <div className="grid grid-cols-4 gap-3 small:grid-cols-6 xl:grid-cols-8">
          {rest.map((category) => (
            <CategoryTile
              key={category.id}
              item={category}
              to={searchPath(undefined, { category: category.slug })}
            />
          ))}
        </div>
      )}

      {data.cuisines.length > 0 && (
        <section>
          <SectionHeader title="Cuisines" to={paths.cuisines} />
          <div className="grid grid-cols-4 gap-3 small:grid-cols-6 xl:grid-cols-8">
            {data.cuisines.map((cuisine) => (
              <CategoryTile
                key={cuisine.id}
                item={cuisine}
                to={paths.cuisine(cuisine.slug)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
