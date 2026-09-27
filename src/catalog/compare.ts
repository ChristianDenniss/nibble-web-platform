import type { CartLine, Offer, Provider } from '@/generated/data-model'

/** Only rank fully priced, fixed-price baskets; fees require a provider checkout quote. */
export function compareCart(lines: CartLine[], providers: Provider[], offers: Offer[], provenance: Record<string, { startingPrice: boolean; fulfillmentMode?: string }>) {
  const rows = providers.map(provider => {
    const matched = lines.map(line => offers.find(offer => offer.menuItemId === line.menuItemId && offer.restaurantId === line.restaurantId && offer.providerId === provider.id))
    const complete = lines.length > 0 && new Set(lines.map(line => line.restaurantId)).size === 1 && matched.every(Boolean)
    const startingPrice = matched.some(offer => offer && provenance[offer.id]?.startingPrice)
    const pickupOnly = matched.some(offer => offer && provenance[offer.id]?.fulfillmentMode === 'pickup')
    const knownSubtotal = matched.reduce((sum, offer, i) => sum + (offer?.price.amountCents ?? 0) * lines[i].quantity, 0)
    return { provider, matched, complete, startingPrice, pickupOnly, subtotal: complete ? knownSubtotal : null, missing: matched.filter(offer => !offer).length, lowest: false }
  }).sort((a, b) => Number(b.complete && !b.startingPrice && !b.pickupOnly) - Number(a.complete && !a.startingPrice && !a.pickupOnly) || Number(b.complete) - Number(a.complete) || (a.subtotal ?? Infinity) - (b.subtotal ?? Infinity) || a.provider.name.localeCompare(b.provider.name))
  const comparable = rows.filter(row => row.complete && !row.startingPrice && !row.pickupOnly)
  const lowest = comparable.length >= 2 ? Math.min(...comparable.map(row => row.subtotal!)) : null
  return rows.map(row => ({ ...row, lowest: lowest !== null && row.complete && !row.startingPrice && !row.pickupOnly && row.subtotal === lowest }))
}
