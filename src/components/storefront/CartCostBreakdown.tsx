import { formatMoney } from '@/lib/money'
import { supportsAutomaticDiscount, type cartTotals } from '@/catalog/cartTotals'

type Totals = ReturnType<typeof cartTotals>
function offerStatus(promotion: Totals['available'][number], totals: Totals, subtotal: number | null) {
  if (promotion.id === totals.promo?.id) return 'Included in the estimate above, assuming eligibility.'
  if (!supportsAutomaticDiscount(promotion.id)) return 'Not included: this offer needs item, location, or fulfillment confirmation before it can be priced.'
  if (subtotal === null) return 'Not included: item prices are needed before this coupon can be applied.'
  if (subtotal < promotion.minimumCents) return `Not included: subtotal must reach ${formatMoney(promotion.minimumCents)}.`
  return 'Not selected because another eligible coupon gives a larger estimated saving.'
}

export default function CartCostBreakdown({ totals, subtotal, pickupOnly }: {
  totals: Totals; subtotal: number | null; pickupOnly: boolean
}) {
  const money = (value: number | null) => value === null ? 'Unavailable' : formatMoney(value)
  return <div className="mt-4 space-y-3 border-t border-border pt-4">
    <dl className="space-y-2 text-sm">{[
      ['Items', money(subtotal)],
      ...(!pickupOnly ? [['Delivery', money(totals.delivery)], ['Service fee', money(totals.service)]] : []),
      ['Coupon', totals.savings > 0 ? `−${formatMoney(totals.savings)}` : formatMoney(0)],
      ['HST (15%)', money(totals.tax)],
      [pickupOnly ? 'Pickup total' : 'Total', money(totals.total)],
    ].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl>
    <p className="text-xs text-content-muted">{totals.promo ? `Applied to this estimate assuming eligibility: ${totals.promo.title}. The provider confirms it at checkout.` : totals.available.length ? 'Offers found, but none can be automatically priced for this cart and service.' : 'No coupon found for this service.'}</p>
    {totals.available.map(p => <div key={p.id} className="rounded-lg bg-page p-3"><p className="text-sm font-medium">{p.title}</p><p className="mt-1 text-xs text-content-muted">{p.terms}</p><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent">Check offer details ↗</a><p className="mt-1 text-xs text-content-muted">{offerStatus(p, totals, subtotal)}</p></div>)}
    <p className="text-xs text-content-muted">{pickupOnly ? 'Pickup menu; delivery is not included.' : 'Estimated fees use a $3.99 delivery and 10% service-fee allowance for each app, not a live quote.'} Tax assumes taxable prepared food and fees. Tip and item extras are excluded; checkout may differ.</p>
  </div>
}
