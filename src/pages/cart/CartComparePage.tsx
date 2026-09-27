import { useState } from 'react'
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
  const [selected, setSelected] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cart unavailable" description={error ?? undefined} />
  if (!cart.lines.length) return <EmptyState title="Nothing to compare" action={<Link to={paths.home} className="text-accent">Browse restaurants</Link>} />
  const rows = compareCart(cart.lines, data.providers, data.offers, catalog.provenance)
  const restaurant = data.restaurants.find(entry => entry.id === cart.lines[0].restaurantId)
  const chosen = rows.find(row => row.provider.id === selected)
  const links: Record<string, Record<string, string>> = catalog.links
  const url = restaurant && chosen ? links[restaurant.id]?.[chosen.provider.id] : undefined
  const cartText = [restaurant?.name, restaurant?.location.address, '', ...cart.lines.map(line => `${line.quantity} × ${data.items.find(item => item.id === line.menuItemId)?.name ?? line.menuItemId}`)].join('\n')
  return <div className="space-y-6">
    <Breadcrumb items={[{ label: 'Cart', href: paths.cart }, { label: 'Best cart prices' }]} />
    <PageTitle icon={<Trophy size={20} />} title="Best cart prices" />
    <p className="text-sm text-content-secondary">The same cart across delivery apps. Compare listed item prices; delivery, service fees, tax, and promotions are confirmed in the app.</p>
    <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="space-y-3">{rows.map(row => {
        const providerLink = restaurant ? links[restaurant.id]?.[row.provider.id] : undefined
        return <article key={row.provider.id} aria-label={`${row.provider.name} cart`} className={`rounded-xl border bg-surface p-4 ${row.lowest ? 'border-accent ring-1 ring-accent/20' : 'border-border'}`}>
          <div className="flex flex-wrap items-center gap-3"><ProviderLogo provider={row.provider} className="size-10 rounded-lg" /><div className="min-w-0 flex-1"><h2 className="font-semibold">{row.provider.name}</h2>{row.lowest && <span className="rounded-full bg-status-success/15 px-2 py-0.5 text-[11px] font-semibold text-status-success">Lowest item subtotal</span>}<p className="mt-1 text-xs text-content-muted">{row.complete ? 'All items priced' : `${row.missing} item prices to confirm`}</p></div><div className="text-right"><p className="text-lg font-semibold text-accent">{row.subtotal !== null ? `${row.startingPrice ? 'From ' : ''}${formatMoney(row.subtotal)}` : 'Confirm in app'}</p><p className="text-[11px] text-content-muted">Items only · fees additional</p></div></div>
          <details className="mt-4 border-t border-border pt-3"><summary className="cursor-pointer text-sm font-medium text-content-secondary">Your cart on {row.provider.name}</summary><ul className="mt-3 space-y-3">{cart.lines.map((line, i) => { const item = data.items.find(item => item.id === line.menuItemId);return <li key={line.id} className="flex items-center gap-2"><ItemImage src={item?.imageURL ?? ''} alt={item?.name ?? 'Item'} seed={line.id} className="size-11 shrink-0 rounded-lg" /><span className="min-w-0 flex-1 text-xs">{line.quantity} × {item?.name}</span><span className="text-xs font-semibold">{row.matched[i] ? formatMoney(row.matched[i].price.amountCents * line.quantity) : 'Confirm in app'}</span></li> })}</ul></details>
          <div className="mt-3 space-y-1 text-xs text-content-muted"><p className="flex justify-between gap-3"><span>Delivery & service fees</span><span>Confirm in app</span></p><p className="flex justify-between gap-3"><span>Tax & promotions</span><span>Confirm in app</span></p></div>
          {providerLink ? <button onClick={() => { setSelected(row.provider.id);setCopied(false);setCopyError(false) }} className="mt-4 text-sm font-semibold text-accent">Continue with {row.provider.name} →</button> : <p className="mt-4 text-xs text-content-muted">A restaurant listing for this provider is not available yet.</p>}
        </article>
      })}</section>
      <aside className="h-fit space-y-3 rounded-xl border border-border bg-surface p-5"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Your cart</p>{cart.lines.map(line => <div key={line.id} className="flex items-center gap-2"><ItemImage src={data.items.find(item => item.id === line.menuItemId)?.imageURL ?? ''} alt="" seed={line.id} className="size-12 shrink-0 rounded-lg" /><span className="text-sm text-content-secondary">{data.items.find(item => item.id === line.menuItemId)?.name} × {line.quantity}</span></div>)}<div className="border-t border-border pt-3"><p className="text-xs text-content-muted">The lowest item subtotal may not be the lowest final delivered price. Review fees and item options in your chosen app.</p><Link to={paths.cart} className="mt-4 inline-flex w-full justify-center text-sm font-semibold text-accent">Edit cart</Link></div></aside>
    </div>
    {chosen && url && <section aria-label="Provider handoff" className="space-y-4 rounded-xl border border-border bg-surface p-5"><h2 className="text-lg font-semibold">Your order for {chosen.provider.name}</h2><p className="text-sm text-content-secondary">Copy your order, then open the restaurant’s menu to add the items and confirm the final price. Your cart is not transferred automatically.</p><textarea aria-label="Order to copy" readOnly value={cartText} className="min-h-36 w-full rounded-lg border border-border bg-page p-3 text-sm" /><div className="flex flex-wrap gap-3"><button onClick={() => { void navigator.clipboard.writeText(cartText).then(() => { setCopied(true);setCopyError(false) }).catch(() => setCopyError(true)) }} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy order'}</button><a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-on-brand">Open {chosen.provider.name}<ExternalLink size={16} /></a></div>{copyError && <p role="alert" className="text-sm">Select the order text above and copy it manually.</p>}</section>}
    {restaurant && <p className="flex items-center gap-2 text-xs text-content-muted"><MapPin size={14} />{restaurant.name} · {restaurant.location.address}</p>}
  </div>
}
