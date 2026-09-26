/**
 * CuisinesPage — dense icon grid of cuisine tiles (sushi, pizza, …).
 */
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CategoryTile from '@/components/storefront/CategoryTile'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function CuisinesPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cuisines unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-content">Cuisines</h1>
        <p className="mt-1 text-sm text-content-secondary">Pick a craving and we’ll show what’s nearby.</p>
      </div>
      <div className="grid grid-cols-4 gap-3 small:grid-cols-6 xl:grid-cols-8">
        {data.cuisines.map((cuisine) => (
          <CategoryTile
            key={cuisine.id}
            item={cuisine}
            to={paths.cuisine(cuisine.slug)}
          />
        ))}
      </div>
    </div>
  )
}
