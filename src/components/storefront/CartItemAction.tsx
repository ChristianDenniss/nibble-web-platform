import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import type { Item } from '@/generated/data-model'

export default function CartItemAction({ item }: { item: Item }) {
  const cart = useCartDraft()
  const [replace, setReplace] = useState(false)
  const line = cart.lines.find(line => line.menuItemId === item.id)
  const add = (confirmed = false) => {
    const added = cart.add({ id: `line_${item.id}`, restaurantId: item.restaurantId, menuItemId: item.id, providerId: '', quantity: 1 }, confirmed)
    setReplace(!added)
  }
  return <>
    {line ? <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface p-1 shadow-sm"><button type="button" aria-label={`Decrease ${item.name}`} onClick={() => cart.setQuantity(line.id, line.quantity - 1)} className="grid size-8 place-items-center rounded-full text-accent"><Minus size={16} /></button><span className="min-w-4 text-center text-sm font-bold">{line.quantity}</span><button type="button" aria-label={`Increase ${item.name}`} disabled={line.quantity >= 50} onClick={() => add()} className="grid size-8 place-items-center rounded-full text-accent disabled:opacity-40"><Plus size={16} /></button></div> : <button type="button" aria-label={`Add ${item.name}`} onClick={() => add()} className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-2 text-sm font-semibold text-on-brand shadow-sm"><Plus size={16} /> Add</button>}
    {replace && <div role="dialog" aria-modal="true" aria-label="Start a new cart" className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-5" onKeyDown={event => { if (event.key === 'Escape') setReplace(false) }}><div className="w-full max-w-sm space-y-4 rounded-2xl bg-surface p-6 shadow-xl"><h2 className="text-lg font-bold">Start a new cart?</h2><p className="text-sm text-content-secondary">Each cart is for one restaurant. Adding {item.name} will replace your current items.</p><div className="flex gap-3"><button autoFocus type="button" onClick={() => setReplace(false)} className="rounded-lg border border-border px-4 py-2">Keep current cart</button><button type="button" onClick={() => add(true)} className="rounded-lg bg-brand px-4 py-2 text-on-brand">Start new cart</button></div></div></div>}
  </>
}
