/**
 * CartPage — line items, store grouping, totals, continue to checkout.
 */
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import CoverBlock from '@/components/storefront/CoverBlock'
import { coverTone } from '@/lib/coverTone'
import { formatMoney } from '@/lib/money'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function CartPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cart unavailable" description={error ?? undefined} />

  const lines = data.cart.lines.map((line) => {
    const item = data.items.find((entry) => entry.id === line.menuItemId)
    const restaurant = data.restaurants.find((entry) => entry.id === line.restaurantId)
    const offer = data.offers.find((entry) => entry.menuItemId === line.menuItemId && entry.providerId === line.providerId)
    const provider = data.providers.find((entry) => entry.id === line.providerId)
    return { line, item, restaurant, offer, provider }
  })

  const subtotal = lines.reduce((sum, row) => sum + (row.offer?.price.amountCents ?? 0) * row.line.quantity, 0)
  const currency = lines[0]?.offer?.price.currency ?? 'CAD'

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Cart' }]} />
      <PageTitle icon={<ShoppingBag size={20} />} title="Cart" count={data.cart.lines.reduce((sum, line) => sum + line.quantity, 0)} />

      {lines.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add a dish from a store to see it here."
          action={<Link to={paths.home} className="text-sm font-medium text-accent">Browse restaurants</Link>}
        />
      ) : (
        <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_18rem]">
          <ul className="space-y-3">
            {lines.map(({ line, item, restaurant, offer, provider }) => (
              <li key={line.id} className="flex gap-3 rounded-xl border border-border bg-surface p-3">
                <CoverBlock
                  tone={coverTone(item?.id ?? line.id)}
                  label={item?.name.slice(0, 1) ?? '?'}
                  className="h-16 w-16 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-content">{item?.name ?? 'Item'}</p>
                  <p className="text-xs text-content-muted">
                    {restaurant?.name} · {provider?.name} · qty {line.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-accent">
                  {offer ? formatMoney(offer.price.amountCents * line.quantity, offer.price.currency) : '—'}
                </p>
              </li>
            ))}
          </ul>
          <aside className="h-fit space-y-3 rounded-xl border border-border bg-surface p-5">
            <div className="flex justify-between text-sm">
              <span className="text-content-secondary">Subtotal</span>
              <span className="font-medium text-accent">{formatMoney(subtotal, currency)}</span>
            </div>
            <p className="text-xs text-content-muted">Taxes and fees are confirmed on the provider checkout.</p>
            <Link
              to={paths.checkout}
              className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand hover:opacity-90"
            >
              Go to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
