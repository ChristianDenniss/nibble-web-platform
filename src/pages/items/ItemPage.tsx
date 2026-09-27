/**
 * ItemPage — dish details, quantity controls and a path back to the menu or cart.
 */
import { useEffect } from 'react'
import catalog from '@/catalog/catalog.json'
import officialItemLinks from '@/catalog/officialItemLinks.json'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CartItemAction from '@/components/storefront/CartItemAction'
import ItemImage from '@/components/storefront/ItemImage'
import { formatMoney } from '@/lib/money'
import { offersForItem, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function ItemPage() {
  const { storeId = '', itemId = '' } = useParams()
  const { loading, data, error } = useStorefront()
  const cart = useCartDraft()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [itemId])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Item unavailable" description={error ?? undefined} />

  const restaurant = data.restaurants.find((entry) => entry.id === storeId)
  const item = data.items.find((entry) => entry.id === itemId && entry.restaurantId === storeId)
  if (!restaurant || !item) return <EmptyState title="Item not found" />
  const offers = offersForItem(data, item.id)
  const detailSource = (catalog.itemDetailsSources as Record<string, { sourceUrl: string }>)[item.id]
  const normalize = (name: string) => name.replace(/[™®]/g, '').trim().toLowerCase()
  const officialItemUrl = restaurant.name.toLowerCase().includes('mcdonald')
    ? Object.entries(officialItemLinks).find(([name]) => normalize(name) === normalize(item.name))?.[1]
    : undefined
  const detailsUrl = officialItemUrl ?? (restaurant.name.toLowerCase().includes('taco boy') ? 'https://www.tacoboyz.com/menu-ingredients/' : detailSource?.sourceUrl)
  const best = [...offers].sort((left, right) => left.price.amountCents - right.price.amountCents)[0]

  return (
    <div className="space-y-6">
      <Link to={paths.store(restaurant.id)} className="inline-flex items-center gap-2 text-sm font-medium text-accent"><ArrowLeft size={16} /> Back to menu</Link>
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
            {detailsUrl && <a href={detailsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-accent transition-colors hover:bg-surface-inset">View nutrition facts <ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
            <p className="mt-4 text-xs text-content-muted">For ingredients, allergens or special requests, confirm with the restaurant before ordering.</p>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5">
          <div><p className="text-sm text-content-secondary">{restaurant.name}</p><h2 className="mt-2 text-xl font-semibold text-content">{best ? `From ${formatMoney(best.price.amountCents, best.price.currency)}` : 'Price unavailable'}</h2></div>
          <p className="text-sm text-content-secondary">Add your favourites, then compare the full cart including delivery and tax.</p>
          <h3 className="text-sm font-semibold text-content">Item prices</h3>
          {offers.length === 0 ? <EmptyState compact title="No prices available" /> : <ul className="space-y-2">{offers.map((offer) => {
            const provider = data.providers.find((entry) => entry.id === offer.providerId)
            return <li key={offer.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2"><div><p className="text-sm font-medium text-content">{provider?.name ?? 'Provider'}</p></div><div className="flex items-center gap-2"><span className="text-sm font-semibold text-accent">{formatMoney(offer.price.amountCents, offer.price.currency)}</span></div></li>
          })}</ul>}
          {offers.length > 0 && <CartItemAction item={item} />}
          {cart.lines.length > 0 && <Link to={paths.cart} className="block rounded-lg bg-brand px-4 py-3 text-center font-semibold text-on-brand">Review cart ({cart.lines.reduce((count, line) => count + line.quantity, 0)})</Link>}
          <Link to={paths.store(restaurant.id)} className="block py-2 text-center text-sm font-medium text-accent">Keep browsing the menu</Link>
        </aside>
      </div>
    </div>
  )
}
