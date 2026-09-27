import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import AppLogo from '@/components/brand/AppLogo'
import ItemImage from '@/components/storefront/ItemImage'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { paths } from '@/routing/paths'

export default function CartPage() {
  const { loading, data, error } = useStorefront()
  const cart = useCartDraft()
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Cart unavailable" description={error ?? undefined} />
  const restaurant = data.restaurants.find(r => r.id === cart.lines[0]?.restaurantId)
  const count = cart.lines.reduce((n, line) => n + line.quantity, 0)
  return <div className="space-y-6"><Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Cart' }]} /><PageTitle icon={<ShoppingBag size={20} />} title="Your cart" count={count} />
    {!cart.lines.length ? <div className="flex flex-col items-center gap-4 px-6 py-16 text-center"><AppLogo className="h-16 w-auto" /><div className="space-y-1"><h2 className="text-xl font-semibold">Your cart is empty</h2><p className="text-sm text-content-secondary">Add items to get started</p></div></div> : <>
      <div><h2 className="text-lg font-semibold">{restaurant?.name}</h2><p className="text-sm text-content-muted">{restaurant?.location.address}</p></div>
      <div className="grid gap-6 small:grid-cols-[minmax(0,1fr)_18rem]"><ul className="space-y-3">{cart.lines.map(line => { const item = data.items.find(i => i.id === line.menuItemId); return <li key={line.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4"><ItemImage src={item?.imageURL ?? ''} alt={item?.name ?? 'Item'} seed={line.id} className="size-20 shrink-0 rounded-lg" /><div className="min-w-0 flex-1"><h3 className="font-semibold">{item?.name}</h3><p className="mt-1 text-xs text-content-muted">Compare this order across all three apps</p></div><div className="flex items-center gap-2"><button aria-label={`Decrease ${item?.name}`} onClick={() => cart.setQuantity(line.id, line.quantity - 1)} className="grid size-9 place-items-center rounded-full border border-border"><Minus size={15} /></button><span className="w-5 text-center font-semibold">{line.quantity}</span><button aria-label={`Increase ${item?.name}`} disabled={line.quantity >= 50} onClick={() => cart.setQuantity(line.id, line.quantity + 1)} className="grid size-9 place-items-center rounded-full border border-border disabled:opacity-40"><Plus size={15} /></button><button aria-label={`Remove ${item?.name}`} onClick={() => cart.remove(line.id)} className="p-2 text-content-muted"><Trash2 size={17} /></button></div></li> })}</ul>
      <aside className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5"><h2 className="font-semibold">Ready to compare?</h2><p className="text-sm text-content-secondary">{count} items. One complete basket for each delivery app, with provider prices and delivery details.</p><Link to={paths.cartCompare} className="block rounded-lg bg-brand px-4 py-3 text-center text-sm font-semibold text-on-brand">Compare whole cart</Link><Link to={restaurant ? paths.store(restaurant.id) : paths.home} className="block text-center text-sm font-semibold text-accent">Add more items</Link><button onClick={() => cart.clear()} className="w-full text-center text-xs text-content-muted">Clear cart</button></aside></div>
    </>}
  </div>
}
