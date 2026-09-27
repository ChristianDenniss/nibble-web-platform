import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import ItemImage from '@/components/storefront/ItemImage'
import Button from '@/components/buttons/Button'
import ProviderLogo from '@/components/brand/ProviderLogo'
import { formatMoney } from '@/lib/money'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { paths } from '@/routing/paths'

export default function CartPage() {
  const { loading, data, error } = useStorefront()
  const [openId, setOpenId] = useState<string | null>(null)
  const draft = useCartDraft(data?.cart.lines ?? [], data?.cart.id, data?.cart.accountId)
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cart unavailable" description={error ?? undefined} />

  const lines = draft.lines.map((line) => ({ line, item: data.items.find((entry) => entry.id === line.menuItemId), restaurant: data.restaurants.find((entry) => entry.id === line.restaurantId), offer: data.offers.find((entry) => entry.menuItemId === line.menuItemId && entry.providerId === line.providerId), provider: data.providers.find((entry) => entry.id === line.providerId) }))
  const subtotal = lines.reduce((sum, row) => sum + (row.offer?.price.amountCents ?? 0) * row.line.quantity, 0)
  const currency = lines[0]?.offer?.price.currency ?? 'CAD'
  const restaurantId = draft.lines[0]?.restaurantId
  const suggestions = data.items.filter((item) => item.restaurantId === restaurantId && !draft.lines.some((line) => line.menuItemId === item.id)).map((item) => ({ item, offer: data.offers.filter((offer) => offer.menuItemId === item.id).sort((a, b) => a.price.amountCents - b.price.amountCents)[0] })).filter((entry) => entry.offer)
  const addSuggestion = (itemId: string, itemRestaurantId: string, providerId: string) => {
    draft.add({ id: `line_${itemId}`, restaurantId: itemRestaurantId, menuItemId: itemId, providerId, quantity: 1 })
  }

  return <div className="space-y-6">
    {draft.saveError && <p role="alert" className="rounded-lg border border-status-danger/30 bg-status-danger/10 px-3 py-2 text-sm text-status-danger">{draft.saveError}</p>}
    <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Cart' }]} />
    <div><PageTitle icon={<ShoppingBag size={20} />} title="Build your order" count={draft.lines.reduce((sum, line) => sum + line.quantity, 0)} /><p className="mt-1 text-sm text-content-secondary">Review your items, spot better deals, and add a little something from {lines[0]?.restaurant?.name ?? 'this store'}.</p></div>
    {!lines.length ? <EmptyState title="Your cart is empty" description="Add a dish from a store to see it here." action={<Link to={paths.home} className="text-sm font-medium text-accent">Browse restaurants</Link>} /> : <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-6">
        <section className="space-y-3"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Your items</p><ul className="space-y-3">{lines.map(({ line, item, restaurant, offer, provider }) => { const expanded = openId === line.id; const related = data.offers.filter((entry) => entry.menuItemId === line.menuItemId).sort((a, b) => a.price.amountCents - b.price.amountCents); return <li key={line.id} className="overflow-hidden rounded-xl border border-border bg-surface">
          <button type="button" onClick={() => setOpenId(expanded ? null : line.id)} aria-expanded={expanded} className="flex w-full items-center gap-3 p-3 text-left hover:bg-surface-inset"><ItemImage src={item?.imageURL ?? ''} alt={item?.name ?? 'Item'} seed={item?.id ?? line.id} label={item ? undefined : '?'} className="h-16 w-16 shrink-0 rounded-lg" /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-content">{item?.name ?? 'Item'} <span className="font-normal text-content-muted">× {line.quantity}</span></span><span className="mt-1 block text-xs text-content-muted">{restaurant?.name} · {provider?.name} · <span className="text-accent">{related.length} deals</span></span></span><span className="text-right"><span className="block text-sm font-medium text-accent">{offer ? formatMoney(offer.price.amountCents * line.quantity, offer.price.currency) : '—'}</span>{expanded ? <ChevronUp size={16} className="ml-auto mt-1 text-content-muted" /> : <ChevronDown size={16} className="ml-auto mt-1 text-content-muted" />}</span></button>
          {expanded && <div className="border-t border-border bg-surface-inset/50 px-3 pb-3 pt-2"><p className="mb-2 text-xs text-content-muted">Compare this item across providers and swap without losing your cart.</p><div className="space-y-2">{related.map((deal) => { const dealProvider = data.providers.find((entry) => entry.id === deal.providerId); const selected = deal.providerId === line.providerId; return <button type="button" key={deal.id} onClick={() => draft.chooseProvider(line.id, deal.providerId)} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs ${selected ? 'border-accent bg-accent/10' : 'border-border bg-surface hover:border-accent/50'}`}>{dealProvider && <ProviderLogo provider={dealProvider} className="size-6 rounded" />}<span className="flex-1 font-medium text-content">{dealProvider?.name}</span><span className="text-content-muted">{deal.estimatedMinutes} min</span><span className="font-semibold text-accent">{formatMoney(deal.price.amountCents, deal.price.currency)}</span>{selected && <span className="text-accent">Selected</span>}</button> })}</div></div>}
        </li> })}</ul></section>
        {suggestions.length > 0 && <section className="rounded-xl border border-accent/20 bg-brand/5 p-4"><div className="flex items-start gap-2"><Sparkles size={18} className="mt-0.5 text-accent" /><div><h2 className="text-sm font-semibold text-content">Good deals from this store</h2><p className="mt-1 text-xs text-content-secondary">Popular add-ons that pair well with what you picked.</p></div></div><div className="mt-3 grid gap-2 small:grid-cols-2">{suggestions.map(({ item, offer }) => offer && <div key={item.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2"><ItemImage src={item.imageURL} alt="" seed={item.id} className="size-12 shrink-0 rounded-md" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-content">{item.name}</p><p className="text-xs text-accent">{formatMoney(offer.price.amountCents, offer.price.currency)}</p></div><Button size="icon" variant="accent" aria-label={`Add ${item.name}`} onClick={() => addSuggestion(item.id, item.restaurantId, offer.providerId)}><Plus size={15} /></Button></div>)}</div></section>}
      </div>
      <aside className="h-fit space-y-3 rounded-xl border border-border bg-surface p-5"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Order snapshot</p><div className="flex justify-between text-sm"><span className="text-content-secondary">Items</span><span className="font-medium text-content">{formatMoney(subtotal, currency)}</span></div><p className="text-xs text-content-muted">We’ll rank the best complete-cart prices next. Fees and taxes are confirmed by the provider.</p><Link to={paths.cartCompare} className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand hover:opacity-90">See best cart prices</Link><Link to={paths.home} className="inline-flex w-full items-center justify-center text-xs font-medium text-content-muted hover:text-content">Keep browsing</Link></aside>
    </div>}
    {!!lines.length && <section className="rounded-xl border border-border bg-surface p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-content">Adjust quantities</h2>{draft.saving && <span className="text-xs text-content-muted">Saving…</span>}</div><div className="mt-3 grid gap-2 small:grid-cols-2">{lines.map(({ line, item }) => <div key={`quantity_${line.id}`} className="flex items-center gap-2 rounded-lg border border-border p-2"><span className="min-w-0 flex-1 truncate text-sm text-content">{item?.name}</span><button type="button" aria-label={`Decrease ${item?.name}`} onClick={() => draft.setQuantity(line.id, line.quantity - 1)} className="grid size-7 place-items-center rounded-full border border-border text-content-muted hover:bg-surface-inset"><Minus size={13} /></button><span className="w-5 text-center text-sm font-semibold text-content">{line.quantity}</span><button type="button" aria-label={`Increase ${item?.name}`} onClick={() => draft.setQuantity(line.id, line.quantity + 1)} className="grid size-7 place-items-center rounded-full border border-border text-content-muted hover:bg-surface-inset"><Plus size={13} /></button><button type="button" aria-label={`Remove ${item?.name}`} onClick={() => draft.remove(line.id)} className="ml-1 grid size-7 place-items-center rounded-full text-content-muted hover:bg-status-danger/10 hover:text-status-danger"><Trash2 size={14} /></button></div>)}</div></section>}
  </div>
}
