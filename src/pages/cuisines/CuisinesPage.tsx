/**
 * CuisinesPage — index of cuisine tiles (sushi, pizza, …).
 */
import { Link } from 'react-router-dom'
import { Utensils } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import CoverBlock from '@/components/storefront/CoverBlock'
import { coverTone } from '@/lib/coverTone'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function CuisinesPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cuisines unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Cuisines' }]} />
      <PageTitle icon={<Utensils size={20} />} title="Cuisines" count={data.cuisines.length} />
      <div className="grid grid-cols-2 gap-3 small:grid-cols-4">
        {data.cuisines.map((cuisine) => (
          <Link
            key={cuisine.id}
            to={paths.cuisine(cuisine.slug)}
            className="rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-surface-brand-hover"
          >
            <CoverBlock tone={coverTone(cuisine.id)} label={cuisine.name.slice(0, 1)} className="h-24" />
            <p className="mt-3 text-center text-sm font-semibold text-content">{cuisine.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
