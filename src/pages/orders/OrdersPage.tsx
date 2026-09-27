/**
 * OrdersPage — past orders with provider, status, and reorder path back to the store.
 */
import { Link } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import StatusBadge from '@/components/badges/StatusBadge'
import { formatMoney } from '@/lib/money'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function OrdersPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Orders unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Account', href: paths.profile }, { label: 'Orders' }]} />
      <PageTitle icon={<Receipt size={20} />} title="Past orders" count={data.orders.length} />
      {data.orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Completed checkouts will show up here." />
      ) : (
        <ul className="space-y-3">
          {data.orders.map((order) => {
            const restaurant = data.restaurants.find((entry) => entry.id === order.restaurantId)
            const provider = data.providers.find((entry) => entry.id === order.providerId)
            return (
              <li key={order.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-content">{restaurant?.name ?? 'Store'}</p>
                    <p className="mt-1 text-xs text-content-muted">
                      {provider?.name} · {new Date(order.placedAt).toLocaleDateString()} · {order.lines.map((line) => line.name).join(', ')}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-accent">{formatMoney(order.total.amountCents, order.total.currency)}</span>
                  {restaurant && (
                    <Link to={paths.store(restaurant.id)} className="text-sm font-medium text-accent">
                      View store
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
