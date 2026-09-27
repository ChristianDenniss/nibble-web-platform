import { useMemo, useState } from 'react'
import { ExternalLink, FileSearch, MapPin, Search, Tags, Utensils } from 'lucide-react'
import PageTitle from '@/components/brand/PageTitle'
import catalog from '@/catalog/catalog.json'
import type { Item, Offer, Restaurant } from '@/generated/data-model'

type Tab = 'restaurants' | 'items' | 'offers'

const providers: Record<string, string> = {
  prov_doordash: 'DoorDash',
  prov_skip: 'SkipTheDishes',
  prov_ubereats: 'Uber Eats',
  prov_direct: 'Restaurant website',
}

const restaurants = catalog.restaurants as Restaurant[]
const items = catalog.items as Item[]
const offers = catalog.offers as Offer[]

export default function DataPage() {
  const [tab, setTab] = useState<Tab>('restaurants')
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 30

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (tab === 'restaurants') return restaurants.filter((restaurant) => !needle || `${restaurant.name} ${restaurant.location.address}`.toLowerCase().includes(needle))
    if (tab === 'items') return items.filter((item) => !needle || `${item.name} ${item.description} ${item.section}`.toLowerCase().includes(needle))
    return offers.filter((offer) => (!needle || `${offer.id} ${offer.menuItemId} ${offer.restaurantId}`.toLowerCase().includes(needle)) && (provider === 'all' || offer.providerId === provider))
  }, [tab, query, provider])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const changeTab = (next: Tab) => { setTab(next); setPage(1); setQuery(''); setProvider('all') }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <PageTitle icon={<FileSearch size={20} />} title="Captured data" count={restaurants.length + items.length + offers.length} />
        <p className="mt-2 max-w-2xl text-sm text-content-secondary">Browse the normalized Fredericton capture that powers the storefront. Every record stays linked to its restaurant, provider, and observed source where available.</p>
      </div>
      <span className="rounded-full bg-status-success/10 px-3 py-1.5 text-xs font-semibold text-status-success">Local snapshot · ready</span>
    </div>

    <section className="grid gap-3 small:grid-cols-3">
      <Summary icon={<MapPin size={18} />} label="Restaurants" value={restaurants.length} detail="merchant locations" />
      <Summary icon={<Utensils size={18} />} label="Menu items" value={items.length} detail="normalized items" />
      <Summary icon={<Tags size={18} />} label="Offers" value={offers.length} detail="provider price observations" />
    </section>

    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {([['restaurants', 'Restaurants', restaurants.length], ['items', 'Menu items', items.length], ['offers', 'Offers', offers.length]] as const).map(([value, label, count]) => <button key={value} type="button" onClick={() => changeTab(value)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === value ? 'bg-brand text-on-brand' : 'text-content-secondary hover:bg-surface-inset'}`}>{label} <span className="ml-1 opacity-70">{count.toLocaleString()}</span></button>)}
      </div>
      <div className="flex flex-wrap gap-3 py-4">
        <label className="relative min-w-60 flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" /><span className="sr-only">Search captured data</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder={tab === 'offers' ? 'Search offer or record ID' : `Search ${tab === 'items' ? 'menu items' : 'restaurants'}`} className="h-10 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-sm outline-none focus:border-accent" /></label>
        {tab === 'offers' && <select value={provider} onChange={(event) => { setProvider(event.target.value); setPage(1) }} className="h-10 rounded-lg border border-input bg-surface px-3 text-sm"><option value="all">All providers</option>{Object.entries(providers).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>}
      </div>
      <p className="mb-3 text-xs text-content-muted">Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length.toLocaleString()}</p>
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-border text-xs uppercase tracking-wide text-content-muted">{tab === 'restaurants' ? <><th className="pb-3 pr-4">Restaurant</th><th className="pb-3 pr-4">Location</th><th className="pb-3 pr-4">Rating</th><th className="pb-3">Source</th></> : tab === 'items' ? <><th className="pb-3 pr-4">Item</th><th className="pb-3 pr-4">Section</th><th className="pb-3">Restaurant</th></> : <><th className="pb-3 pr-4">Provider</th><th className="pb-3 pr-4">Item</th><th className="pb-3 pr-4">Price</th><th className="pb-3">Timing</th></>}</tr></thead><tbody>{visible.map((record) => tab === 'restaurants' ? <RestaurantRow key={(record as Restaurant).id} restaurant={record as Restaurant} /> : tab === 'items' ? <ItemRow key={(record as Item).id} item={record as Item} /> : <OfferRow key={(record as Offer).id} offer={record as Offer} />)}</tbody></table></div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-xs text-content-muted">Page {page} of {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40">Next</button></div>
    </section>
  </div>
}

function Summary({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: number; detail: string }) { return <div className="rounded-2xl border border-border bg-surface p-4"><div className="flex items-center gap-2 text-accent">{icon}<span className="text-xs font-semibold uppercase tracking-wide text-content-muted">{label}</span></div><p className="mt-2 text-2xl font-bold text-content">{value.toLocaleString()}</p><p className="text-xs text-content-secondary">{detail}</p></div> }
function RestaurantRow({ restaurant }: { restaurant: Restaurant }) { const source = (catalog.links as Record<string, { sourceUrl?: string }>)[restaurant.id]?.sourceUrl; return <tr className="border-b border-border/70 align-top"><td className="py-3 pr-4 font-semibold text-content">{restaurant.name}<span className="mt-1 block max-w-xs truncate text-xs font-normal text-content-muted">{restaurant.id}</span></td><td className="py-3 pr-4 text-content-secondary">{restaurant.location.address || restaurant.location.city}</td><td className="py-3 pr-4 text-content-secondary">{restaurant.rating.average.toFixed(1)} <span className="text-xs">({restaurant.rating.count})</span></td><td className="py-3">{source ? <a href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">Open source <ExternalLink size={13} /></a> : <span className="text-content-muted">—</span>}</td></tr> }
function ItemRow({ item }: { item: Item }) { const restaurant = restaurants.find((entry) => entry.id === item.restaurantId); return <tr className="border-b border-border/70 align-top"><td className="py-3 pr-4 font-semibold text-content">{item.name}<span className="mt-1 block max-w-sm truncate text-xs font-normal text-content-muted">{item.description || item.id}</span></td><td className="py-3 pr-4 text-content-secondary">{item.section || '—'}</td><td className="py-3 text-content-secondary">{restaurant?.name ?? item.restaurantId}</td></tr> }
function OfferRow({ offer }: { offer: Offer }) { const item = items.find((entry) => entry.id === offer.menuItemId); const restaurant = restaurants.find((entry) => entry.id === offer.restaurantId); return <tr className="border-b border-border/70 align-top"><td className="py-3 pr-4 font-semibold text-content">{providers[offer.providerId] ?? offer.providerId}</td><td className="py-3 pr-4 text-content-secondary">{item?.name ?? offer.menuItemId}<span className="mt-1 block max-w-xs truncate text-xs text-content-muted">{restaurant?.name ?? offer.restaurantId}</span></td><td className="py-3 pr-4 font-semibold text-content">${(offer.price.amountCents / 100).toFixed(2)} <span className="text-xs font-normal text-content-muted">{offer.price.currency}</span></td><td className="py-3 text-content-secondary">{offer.estimatedMinutes > 0 ? `${offer.estimatedMinutes} min` : 'Not captured'}</td></tr> }
