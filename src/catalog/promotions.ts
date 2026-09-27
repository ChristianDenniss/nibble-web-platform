export interface Promotion {
  id: string
  providerId: string
  title: string
  sourceUrl: string
  terms: string
  expiresOn: string | null
  code: string
  restaurantNameContains: string
  minimumCents: number
  country: string
  eligibility: string
  reviewedAt: string
  verifiedAt?: string
  needsReview?: boolean
}

/** Public offers are suggestions, never checkout-authorized discounts. */
export function availablePromotions(promotions: Promotion[], providerIds: string[], restaurantName: string, now = new Date()) {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Moncton', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  return promotions.filter(promotion => {
    const verified = Date.parse(promotion.verifiedAt ?? promotion.reviewedAt)
    return providerIds.includes(promotion.providerId)
      && promotion.country === 'CA'
      && !promotion.needsReview
      && Number.isFinite(verified) && now.getTime() >= verified && now.getTime() - verified < 72 * 3600_000
      && (!promotion.expiresOn || promotion.expiresOn >= day)
      && (!promotion.restaurantNameContains || restaurantName.toLowerCase().includes(promotion.restaurantNameContains.toLowerCase()))
  })
}

/** Only restaurant offers; acquisition must explicitly classify new public offers. */
export function restaurantPromotions(promotions: Promotion[]) {
  return promotions.filter(p => p.restaurantNameContains && (p.id === 'dd-wendy-bogo' || p.eligibility === 'public_restaurant'))
}
