/**
 * ItemPage — one dish with provider price comparison and a checkout handoff.
 */
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import Button from '@/components/buttons/Button'
import Pill from '@/components/pills/Pill'
import ItemImage from '@/components/storefront/ItemImage'
import { formatMoney } from '@/lib/money'
import { offersForItem, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function ItemPage() {
  const { storeId = '', itemId = '' } = useParams()
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Item unavailable" description={error ?? undefined} />

  const restaurant = data.restaurants.find((entry) => entry.id === storeId)
  const item = data.items.find((entry) => entry.id === itemId && entry.restaurantId === storeId)
  if (!restaurant || !item) return <EmptyState title="Item not found" />

  const offers = offersForItem(data, item.id)
  const best = [...offers].sort((left, right) => left.price.amountCents - right.price.amountCents)[0]

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
          <h2 className="text-sm font-semibold text-content">Compare providers</h2>
          {offers.length === 0 ? (
            <EmptyState compact title="No live offers" />
          ) : (
            <ul className="space-y-2">
              {offers.map((offer) => {
                const provider = data.providers.find((entry) => entry.id === offer.providerId)
                const isBest = best?.id === offer.id
                return (
                  <li key={offer.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-content">{provider?.name ?? 'Provider'}</p>
                      <p className="text-xs text-content-muted">{offer.estimatedMinutes} min</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isBest && <Pill success bare>Best</Pill>}
                      <span className="text-sm font-semibold text-accent">{formatMoney(offer.price.amountCents, offer.price.currency)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Button className="w-full" disabled={!best}>Add to cart</Button>
          <Link
            to={paths.checkout}
            className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand hover:opacity-90"
          >
            Checkout on {data.providers.find((entry) => entry.id === best?.providerId)?.name ?? 'provider'}
          </Link>
        </aside>
      </div>
    </div>
  )
}
