import { estimateFees } from '@/catalog/feeEstimates'
import { restaurantPromotions } from '@/catalog/promotions'
import CartCostBreakdown from '@/components/storefront/CartCostBreakdown'
import { cartTotals } from '@/catalog/cartTotals'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, ExternalLink, MapPin, Trophy } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import ProviderLogo from '@/components/brand/ProviderLogo'
import ItemImage from '@/components/storefront/ItemImage'
import { formatMoney } from '@/lib/money'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { paths } from '@/routing/paths'
import catalog from '@/catalog/catalog.json'
import { compareCart } from '@/catalog/compare'

export default function CartComparePage() {
  const { loading, data, error } = useStorefront()
  const cart = useCartDraft()
  const [expanded, setExpanded] = useState('')
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer) }, [])
  const [selected, setSelected] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cart unavailable" description={error ?? undefined} />
  if (!cart.lines.length) return <EmptyState title="Nothing to compare" action={<Link to={paths.home} className="text-accent">Browse restaurants</Link>} />
  const restaurant = data.restaurants.find(entry => entry.id === cart.lines[0].restaurantId)
  const ordering: Record<string, { orderUrl: string; note: string }> = catalog.merchantOrdering
  const merchant = restaurant ? ordering[restaurant.id] : undefined
  const directOnly = restaurant?.id.startsWith('catalog-direct-')
  const providers = data.providers.filter(provider => directOnly ? provider.id === 'prov_direct' : provider.id !== 'prov_direct' || data.offers.some(offer => offer.providerId === 'prov_direct' && offer.restaurantId === restaurant?.id))
  const rows = compareCart(cart.lines, providers, data.offers, catalog.provenance)
  const costRows = rows.map(row => {
    const fees = estimateFees(row.provider.id, row.subtotal, row.pickupOnly)
    return { ...row, totals: cartTotals(row.subtotal, row.provider.id, restaurant?.name ?? '', fees.delivery, fees.service, restaurantPromotions(catalog.promotions), [], now) }
  }).sort((a, b) => (a.totals.total ?? Infinity) - (b.totals.total ?? Infinity))
  const comparable = costRows.filter(row => !row.startingPrice && !row.pickupOnly && row.totals.total !== null)
  const best = comparable.length >= 2 ? Math.min(...comparable.map(row => row.totals.total!)) : null
  const chosen = rows.find(row => row.provider.id === selected)
  const links: Record<string, Record<string, string>> = catalog.links
  const url = chosen?.provider.id === 'prov_direct' ? merchant?.orderUrl : restaurant && chosen ? links[restaurant.id]?.[chosen.provider.id] : undefined
  const cartText = [restaurant?.name, restaurant?.location.address, '', ...cart.lines.map(line => `${line.quantity} × ${data.items.find(item => item.id === line.menuItemId)?.name ?? line.menuItemId}`)].join('\n')
  return <div className="space-y-6">
    <Breadcrumb items={[{ label: 'Cart', href: paths.cart }, { label: 'Best cart prices' }]} />
    <PageTitle icon={<Trophy size={20} />} title="Best cart prices" />
    <p className="text-sm text-content-secondary">Compare your whole cart, with tax, delivery fees, and restaurant offers. Select a provider to see the breakdown.</p>
    <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="space-y-3">{costRows.map(row => {
        const lowest = best !== null && !row.startingPrice && !row.pickupOnly && row.totals.total === best
        const open = expanded === row.provider.id
        const providerLink = row.provider.id === 'prov_direct' ? merchant?.orderUrl : restaurant ? links[restaurant.id]?.[row.provider.id] : undefined
        return <article key={row.provider.id} aria-label={`${row.provider.name} cart`} className={`rounded-xl border bg-surface p-4 ${lowest ? 'border-accent ring-1 ring-accent/20' : 'border-border'}`}>
          <button type="button" aria-expanded={open} aria-controls={`cost-${row.provider.id}`} onClick={() => setExpanded(open ? '' : row.provider.id)} className="flex w-full flex-wrap items-center gap-3 text-left"><ProviderLogo provider={row.provider} className="size-10 rounded-lg" /><div className="min-w-0 flex-1"><h2 className="font-semibold">{row.provider.name}</h2>{lowest && <span className="rounded-full bg-status-success/15 px-2 py-0.5 text-[11px] font-semibold text-status-success">Lowest estimate</span>}<p className="mt-1 text-xs text-content-muted">{row.complete ? 'All items priced' : `${row.missing} item prices to confirm`}</p></div><div className="text-right"><p className="text-lg font-semibold text-accent">{row.totals.total !== null ? `${row.startingPrice ? 'From ' : ''}${formatMoney(row.totals.total)}` : row.subtotal !== null ? formatMoney(row.subtotal) : 'Price unavailable'}</p><p className="text-[11px] text-content-muted">{row.totals.total !== null ? row.pickupOnly ? 'Pickup estimate · no tip' : 'Estimated total · no tip' : 'Items only · fees needed'} · {open ? 'Collapse −' : 'Expand +'}</p></div></button>
          {open && <div id={`cost-${row.provider.id}`}>
          <details className="mt-4 border-t border-border pt-3"><summary className="cursor-pointer text-sm font-medium text-content-secondary">Your cart on {row.provider.name}</summary><ul className="mt-3 space-y-3">{cart.lines.map((line, i) => { const item = data.items.find(item => item.id === line.menuItemId);return <li key={line.id} className="flex items-center gap-2"><ItemImage src={item?.imageURL ?? ''} alt={item?.name ?? 'Item'} seed={line.id} className="size-11 shrink-0 rounded-lg" /><span className="min-w-0 flex-1 text-xs">{line.quantity} × {item?.name}</span><span className="text-xs font-semibold">{row.matched[i] ? formatMoney(row.matched[i].price.amountCents * line.quantity) : 'Confirm at checkout'}</span></li> })}</ul></details>
          <CartCostBreakdown totals={row.totals} subtotal={row.subtotal} pickupOnly={row.pickupOnly} />
          {row.provider.id === 'prov_direct' && merchant && <p className="mt-3 text-xs text-content-secondary">{merchant.note}</p>}
          {providerLink ? <button onClick={() => { setSelected(row.provider.id);setCopied(false);setCopyError(false) }} className="mt-4 text-sm font-semibold text-accent">Continue with {row.provider.name} →</button> : <p className="mt-4 text-xs text-content-muted">A restaurant listing for this provider is not available yet.</p>}
          </div>}
        </article>
      })}</section>
      <aside className="h-fit space-y-3 rounded-xl border border-border bg-surface p-5"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Your cart</p>{cart.lines.map(line => <div key={line.id} className="flex items-center gap-2"><ItemImage src={data.items.find(item => item.id === line.menuItemId)?.imageURL ?? ''} alt="" seed={line.id} className="size-12 shrink-0 rounded-lg" /><span className="text-sm text-content-secondary">{data.items.find(item => item.id === line.menuItemId)?.name} × {line.quantity}</span></div>)}<div className="border-t border-border pt-3"><p className="text-xs text-content-muted">Delivery, service fees, and tax included. Final checkout prices may vary.</p><Link to={paths.cart} className="mt-4 inline-flex w-full justify-center text-sm font-semibold text-accent">Edit cart</Link></div></aside>
    </div>
    {chosen && url && <section aria-label="Provider handoff" className="space-y-4 rounded-xl border border-border bg-surface p-5"><h2 className="text-lg font-semibold">Your order for {chosen.provider.name}</h2><p className="text-sm text-content-secondary">Copy your order, then open the restaurant’s menu to add the items and confirm the final price. Your cart is not transferred automatically.</p><textarea aria-label="Order to copy" readOnly value={cartText} className="min-h-36 w-full rounded-lg border border-border bg-page p-3 text-sm" /><div className="flex flex-wrap gap-3"><button onClick={() => { void navigator.clipboard.writeText(cartText).then(() => { setCopied(true);setCopyError(false) }).catch(() => setCopyError(true)) }} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy order'}</button><a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-on-brand">Open {chosen.provider.name}<ExternalLink size={16} /></a></div>{copyError && <p role="alert" className="text-sm">Select the order text above and copy it manually.</p>}</section>}
    {restaurant && <p className="flex items-center gap-2 text-xs text-content-muted"><MapPin size={14} />{restaurant.name} · {restaurant.location.address}</p>}
  </div>
}
