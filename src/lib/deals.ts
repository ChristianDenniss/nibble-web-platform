import type { ActivePromotion, Item, Offer, Restaurant } from '@/generated/data-model'

export type DealContext = { restaurant?: Restaurant; item?: Item; region?: string; country?: string }

function channelMatches(channelId: string, providerId: string) {
  if (!channelId) return true
  const a = channelId.toLowerCase().replace(/^ch_/, '')
  const b = providerId.toLowerCase().replace(/^prov_/, '')
  return a === b || a.includes(b) || b.includes(a)
}

export function dealApplies(deal: ActivePromotion, offer: Offer, context: DealContext) {
  const { promotion, targets } = deal
  const now = Date.now()
  if (new Date(promotion.startsAt).getTime() > now || new Date(promotion.endsAt).getTime() < now) return false
  if (!channelMatches(promotion.channelId, offer.providerId)) return false
  if (!targets.length) return true
  return targets.some((target) =>
    (!target.legacyRestaurantId || target.legacyRestaurantId === offer.restaurantId) &&
    (!target.sourceItemId || target.sourceItemId === offer.menuItemId) &&
    (!target.region || target.region.toLowerCase() === (context.region ?? context.restaurant?.location.region ?? '').toLowerCase()) &&
    (!target.country || target.country.toLowerCase() === (context.country ?? '').toLowerCase()),
  )
}

export function bestDealForOffer(deals: ActivePromotion[], offer: Offer, context: DealContext) {
  return deals.filter((deal) => dealApplies(deal, offer, context)).sort((a, b) => discountCents(b.promotion, offer.price.amountCents) - discountCents(a.promotion, offer.price.amountCents))[0]
}

function discountCents(promotion: ActivePromotion['promotion'], cents: number) {
  if (promotion.kind === 'percent_off') return Math.floor(cents * promotion.valueBPS / 10000)
  if (promotion.kind === 'amount_off') return Math.min(cents, promotion.value.amountCents)
  return 0
}

export function effectiveOffer(deals: ActivePromotion[], offer: Offer, context: DealContext): Offer & { deal?: ActivePromotion } {
  const deal = bestDealForOffer(deals, offer, context)
  if (!deal || deal.promotion.kind === 'free_delivery') return { ...offer, deal }
  return { ...offer, price: { ...offer.price, amountCents: Math.max(0, offer.price.amountCents - discountCents(deal.promotion, offer.price.amountCents)) }, deal }
}

export function dealLabel(deal: ActivePromotion) {
  const p = deal.promotion
  if (p.kind === 'free_delivery') return 'Free delivery'
  if (p.kind === 'percent_off') return `${p.valueBPS / 100}% off`
  return `$${(p.value.amountCents / 100).toFixed(0)} off`
}
