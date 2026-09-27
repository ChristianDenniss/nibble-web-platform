import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronLeft, Clock3, MapPin, Trophy } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import ProviderLogo from '@/components/brand/ProviderLogo'
import { formatMoney } from '@/lib/money'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { paths } from '@/routing/paths'

function estimatedFeeCents(providerName: string, itemCount: number) {
  const name = providerName.toLowerCase()
  const base = name.includes('skip') ? 299 : name.includes('door') ? 399 : name.includes('uber') ? 399 : 349
  return base + Math.max(0, itemCount - 2) * 49
}

export default function CartComparePage() {
  const { loading, data, error } = useStorefront()
  const draft = useCartDraft(data?.cart.lines ?? [], data?.cart.id, data?.cart.accountId)
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cart unavailable" description={error ?? undefined} />
  if (!draft.lines.length) return <EmptyState title="Nothing to compare" action={<Link to={paths.cart} className="text-sm text-accent">Back to cart</Link>} />

  const rows = data.providers.map((provider) => {
    const offers = draft.lines.map((line) => data.offers.find((offer) => offer.menuItemId === line.menuItemId && offer.providerId === provider.id))
    const complete = offers.every(Boolean)
    const subtotal = offers.reduce((sum, offer, index) => sum + (offer?.price.amountCents ?? 0) * draft.lines[index].quantity, 0)
    const fee = estimatedFeeCents(provider.name, draft.lines.length)
    const total = subtotal + fee
    const eta = Math.max(...offers.map((offer) => offer?.estimatedMinutes ?? 0))
    return { provider, complete, total, fee, eta }
  }).filter((row) => row.complete).sort((a, b) => a.total - b.total)
  const best = rows[0]
  const restaurant = data.restaurants.find((entry) => entry.id === draft.lines[0].restaurantId)

  return <div className="space-y-6">
    <Breadcrumb items={[{ label: 'Cart', href: paths.cart }, { label: 'Best cart prices' }]} />
    <PageTitle icon={<Trophy size={20} />} title="Best cart prices" />
    <div className="flex items-center gap-2 text-sm text-content-secondary"><Check size={16} className="text-status-success" /> Every option below includes your full cart</div>
    <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="space-y-3">
        {rows.map((row, index) => <article key={row.provider.id} className={`rounded-xl border bg-surface p-4 ${index === 0 ? 'border-accent ring-1 ring-accent/20' : 'border-border'}`}>
          <div className="flex items-center gap-3">
            <ProviderLogo provider={row.provider} className="size-10 rounded-lg" />
            <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold text-content">{row.provider.name}</h2>{index === 0 && <span className="rounded-full bg-status-success/15 px-2 py-0.5 text-[11px] font-semibold text-status-success">Best total</span>}</div><p className="mt-1 flex items-center gap-1 text-xs text-content-muted"><Clock3 size={13} /> About {row.eta} min</p></div>
            <div className="text-right"><p className="text-lg font-semibold text-accent">{formatMoney(row.total)}</p><p className="text-[11px] text-content-muted">includes ~{formatMoney(row.fee)} service fees</p><Link to={paths.checkout} className="text-xs font-medium text-accent hover:underline">Choose this option <ArrowRight size={12} className="inline" /></Link></div>
          </div>
        </article>)}
        {!rows.length && <div className="rounded-xl border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-content-secondary">No single provider currently carries every item. Try swapping an item in your cart or order direct from the store.</div>}
      </section>
      <aside className="h-fit space-y-3 rounded-xl border border-border bg-surface p-5"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Your cart</p>{draft.lines.map((line) => <p key={line.id} className="flex justify-between gap-3 text-sm"><span className="text-content-secondary">{data.items.find((item) => item.id === line.menuItemId)?.name} × {line.quantity}</span><span className="text-content">Included</span></p>)}<div className="border-t border-border pt-3"><p className="text-xs text-content-muted">Totals include estimated service fees. Taxes and final delivery charges are confirmed after handoff.</p>{best && <Link to={paths.checkout} className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-on-brand">Continue with {best.provider.name}</Link>}<Link to={paths.cart} className="mt-2 inline-flex w-full items-center justify-center gap-1 text-xs font-medium text-content-muted hover:text-content"><ChevronLeft size={14} /> Edit cart</Link></div></aside>
    </div>
    {restaurant && <p className="flex items-center gap-2 text-xs text-content-muted"><MapPin size={14} /> {restaurant.name} · {restaurant.location.address}</p>}
  </div>
}
