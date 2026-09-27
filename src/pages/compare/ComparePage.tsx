import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Clock3, RotateCcw, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useCompare } from '@/hooks/compare/useCompare'
import type { ComparePathRankWire } from '@/types/compare-wire'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { formatMoney } from '@/lib/money'
import ProviderLogo from '@/components/brand/ProviderLogo'
import Button from '@/components/buttons/Button'
import PageLoader from '@/components/layout/PageLoader'
import { paths } from '@/routing/paths'

const demos = [
  { placeId: 'pl_demo', dishId: 'dish_burger', label: 'Classic Burger', restaurant: 'Demo Burger' },
  { placeId: 'pl_demo', dishId: 'dish_koi_tuna', label: 'Spicy Tuna Roll', restaurant: 'Koi Sushi' },
]

const cents = (path: ComparePathRankWire) => path.all_in.amount_cents
const providerOf = (path: ComparePathRankWire) => ({ id: path.provider_id ?? path.channel_id, name: path.provider_name ?? path.headline })

function Breakdown({ path }: { path: ComparePathRankWire }) {
  return <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
    <div className="flex justify-between"><span className="text-content-secondary">Item price</span><span>{formatMoney(path.item_subtotal?.amount_cents ?? cents(path), path.all_in.currency)}</span></div>
    {(path.fees ?? []).map((fee) => <div className="flex justify-between" key={`${path.purchase_option_id}-${fee.kind}`}><span className="capitalize text-content-secondary">{fee.kind} cost</span><span>{formatMoney(fee.amount.amount_cents, fee.amount.currency)}</span></div>)}
    {(path.discounts ?? []).length > 0 ? (path.discounts ?? []).map((discount) => <div className="flex justify-between gap-3 text-status-success" key={`${path.purchase_option_id}-${discount.scope}-${discount.label}`}><span><span className="capitalize">{discount.scope}</span> · {discount.label}</span><span>−{formatMoney(discount.amount.amount_cents, discount.amount.currency)}</span></div>) : <div className="flex justify-between text-content-muted"><span>Discounts</span><span>None — raw price</span></div>}
    <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>All-in estimate</span><span className="text-lg text-accent">{formatMoney(cents(path), path.all_in.currency)}</span></div>
  </div>
}

function OptionCard({ path, best, maxTotal }: { path: ComparePathRankWire; best: boolean; maxTotal: number }) {
  const saving = maxTotal - cents(path)
  const provider = providerOf(path)
  return <article className={`relative rounded-2xl border bg-surface p-5 ${best ? 'border-status-success ring-2 ring-status-success/20' : 'border-border'}`}>
    {best && <span className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-status-success px-3 py-1 text-xs font-bold text-white"><Sparkles size={13} /> Best value</span>}
    <div className="flex items-start gap-3"><ProviderLogo provider={provider} className="size-11 rounded-xl" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-content">{provider.name}</h3>{saving > 0 && <span className="rounded-full bg-status-success/15 px-2 py-0.5 text-xs font-semibold text-status-success">Save {formatMoney(saving)}</span>}</div><p className="mt-1 flex items-center gap-1 text-xs text-content-muted"><Clock3 size={13} /> {path.eta_minutes ? `${path.eta_minutes} min` : 'ETA at handoff'} · {path.fulfillment_mode}</p></div></div>
    <Breakdown path={path} />
    {path.rationale_bullets?.length ? <ul className="mt-3 space-y-1 text-xs text-content-secondary">{path.rationale_bullets.slice(0, 3).map((reason) => <li className="flex gap-2" key={reason}><Check size={14} className="mt-0.5 shrink-0 text-status-success" />{reason}</li>)}</ul> : null}
    <p className="mt-4 border-t border-border pt-3 text-xs text-content-muted">Compare this option here, then add the recommended option to your cart above.</p>
  </article>
}

export default function ComparePage() {
  const { form, setForm, loading, error, result, runCompare, resetCompare } = useCompare()
  const { loading: catalogLoading, data, error: catalogError } = useStorefront()
  const draft = useCartDraft(data?.cart.lines ?? [], data?.cart.id, data?.cart.accountId)
  const navigate = useNavigate()
  const options = useMemo(() => result ? [result.recommendation, ...(result.runners_up ?? [])].filter((path): path is ComparePathRankWire => Boolean(path)) : [], [result])
  const best = options[0]
  const maxTotal = Math.max(...options.map(cents), 0)
  const resetDemo = () => { sessionStorage.removeItem('nibble-cart-draft:acct_dev'); resetCompare() }
  const choose = (path: ComparePathRankWire) => {
    if (!data) return
    draft.add({ id: `compare_${path.menu_item_id ?? 'item_koi_tuna'}`, restaurantId: path.restaurant_id ?? 'rest_koi', menuItemId: path.menu_item_id ?? 'item_koi_tuna', providerId: path.provider_id ?? 'prov_skip', quantity: form.quantity })
    navigate(paths.checkout)
  }
  if (catalogLoading && !data) return <PageLoader />

  return <div className="mx-auto max-w-6xl space-y-7 pb-8">
    <section className="overflow-hidden rounded-3xl bg-brand px-6 py-8 text-on-brand shadow-sm small:px-10 small:py-10"><div className="max-w-2xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1 text-xs font-bold uppercase tracking-wider"><Zap size={14} /> Nibble price check</div><h1 className="text-3xl font-bold tracking-tight small:text-5xl">Same dish. Smarter order.</h1><p className="mt-3 max-w-xl text-base text-on-brand/75 small:text-lg">See the real total across providers, spot the savings, and jump straight to the best way to get it.</p></div>
      <form className="mt-7 grid gap-3 rounded-2xl bg-white/95 p-3 text-content shadow-lg small:grid-cols-[1fr_auto]" onSubmit={(event) => { event.preventDefault(); void runCompare() }}><label className="flex items-center gap-3 px-2"><Search size={20} className="text-content-muted" /><span className="sr-only">Search for a dish</span><input aria-label="Search for a dish" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none" value={demos.find((choice) => choice.dishId === form.dishId)?.label ?? 'Classic Burger'} onChange={(event) => { const choice = demos.find((entry) => entry.label.toLowerCase().includes(event.target.value.toLowerCase())) ?? demos[0]; setForm((current) => ({ ...current, placeId: choice.placeId, dishId: choice.dishId })) }} /></label><Button type="submit" disabled={loading} className="h-12 px-6">{loading ? 'Checking prices…' : 'Compare prices'} <ArrowRight size={16} /></Button></form>
      <div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="mr-1 self-center text-on-brand/60">Try the demo:</span>{demos.map((choice, index) => <button type="button" key={`${choice.label}-${index}`} onClick={() => setForm((current) => ({ ...current, placeId: choice.placeId, dishId: choice.dishId }))} className="rounded-full border border-on-brand/25 px-3 py-1.5 font-medium hover:bg-white/15">{choice.restaurant} · {choice.label}</button>)}</div>
    </section>
    {error && <div role="alert" className="rounded-xl border border-status-danger/30 bg-status-danger/10 p-4 text-sm text-status-danger"><strong>We couldn’t compare that yet.</strong> {error} <button type="button" onClick={() => void runCompare()} className="ml-2 font-semibold underline">Try again</button></div>}
    {catalogError && <p className="text-sm text-status-warning">Demo catalog is unavailable. Refresh before handing off to a provider.</p>}
    {!result && !loading && <section className="grid gap-4 text-center small:grid-cols-3">{[['01', 'Pick a dish', 'Search or use a demo restaurant above.'], ['02', 'See the true total', 'Menu price, delivery, service fees, ETA — together.'], ['03', 'Order with confidence', 'Add the winner and hand off in one click.']].map(([number, title, body]) => <div className="rounded-2xl border border-border bg-surface p-5" key={number}><p className="text-2xl font-bold text-accent">{number}</p><p className="mt-2 font-semibold">{title}</p><p className="mt-1 text-sm text-content-secondary">{body}</p></div>)}</section>}
    {result && best && <><section className="grid gap-4 rounded-2xl border border-status-success/30 bg-status-success/10 p-5 small:grid-cols-[1fr_auto] small:items-center"><div><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-status-success"><ShieldCheck size={17} /> Recommended for you</p><h2 className="mt-1 text-2xl font-bold text-content">Save {formatMoney(maxTotal - cents(best))} with {providerOf(best).name}</h2><p className="mt-1 text-sm text-content-secondary">Lowest complete total for {best.item_name ?? 'this dish'}{best.eta_minutes ? ` · arrives in about ${best.eta_minutes} minutes` : ''}. We included every observed cost.</p></div><Button type="button" onClick={() => choose(best)} className="h-11 px-5">Add to cart <ArrowRight size={16} /></Button></section><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-content-muted">Price comparison</p><h2 className="mt-1 text-2xl font-bold text-content">{best.item_name ?? 'Your dish'} across providers</h2></div><button type="button" onClick={resetDemo} className="inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-content"><RotateCcw size={15} /> Reset demo</button></div><div className="grid gap-4 small:grid-cols-3">{options.map((path, index) => <OptionCard key={path.purchase_option_id} path={path} best={index === 0} maxTotal={maxTotal} />)}</div><p className="text-center text-xs text-content-muted">Prices are estimates observed at compare time. The provider confirms final taxes and availability after handoff.</p></>}
    {!result && !loading && <p className="text-center text-sm text-content-muted">Demo data is ready — choose a dish to see the savings.</p>}
  </div>
}
