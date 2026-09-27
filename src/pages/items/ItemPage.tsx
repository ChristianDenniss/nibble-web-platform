/**
 * ItemPage — one dish with provider price comparison and a checkout handoff.
 */
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CartItemAction from '@/components/storefront/CartItemAction'
import ItemImage from '@/components/storefront/ItemImage'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function ItemPage() {
  const { storeId = '', itemId = '' } = useParams()
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Item unavailable" description={error ?? undefined} />

  const restaurant = data.restaurants.find((entry) => entry.id === storeId)
  const item = data.items.find((entry) => entry.id === itemId && entry.restaurantId === storeId)
  if (!restaurant || !item) return <EmptyState title="Item not found" />

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: paths.home },
          { label: restaurant.name, href: paths.store(restaurant.id) },
          { label: item.name },
        ]}
      />
      <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="space-y-4">
          <ItemImage src={item.imageURL} alt={item.name} seed={item.id} label={item.name} className="h-72 w-full rounded-xl max-small:h-56" />
          <div>
            <p className="text-sm text-content-muted">{item.section}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-content">{item.name}</h1>
            <p className="mt-2 text-sm text-content-secondary">{item.description}</p>
          </div>
        </div>

        <aside className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold">Add to your order</h2>
          <p className="text-sm text-content-secondary">Choose your items first. Compare the whole cart across Uber Eats, DoorDash, and Skip next.</p>
          <CartItemAction item={item} />
          <Link to={paths.cart} className="block rounded-lg border border-border px-4 py-3 text-center font-semibold text-accent">Review cart</Link>
        </aside>
      </div>
    </div>
  )
}
