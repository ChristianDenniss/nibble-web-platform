import { availablePromotions, type Promotion } from './promotions.ts'

const rules: Record<string, { fixed?: number; percent?: number; cap?: number; deliveryFree?: boolean }> = {
  'uber-first-30': { fixed: 3000 },
  'dd-first-40': { percent: 40, cap: 1300, deliveryFree: true },
  'dd-targeted-25': { percent: 25, cap: 800 },
  'skip-cibc-welcome': { fixed: 2000 },
  'swiss-first-five': { fixed: 500 },
}
export function supportsAutomaticDiscount(id: string) { return !!rules[id] }
export function feeCents(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null
  const cents = Math.round(Number(value) * 100)
  return Number.isSafeInteger(cents) && cents <= 100000 ? cents : null
}

/** Estimates assume taxable prepared food and fees in New Brunswick; no tip. */
export function cartTotals(subtotal: number | null, providerId: string, restaurantName: string, delivery: number | null, service: number | null, promotions: Promotion[], confirmed: string[], now = new Date(), assumeEligible = false) {
  const available = availablePromotions(promotions, [providerId], restaurantName, now)
  const candidates = available.filter(p => (confirmed.includes(p.id) || assumeEligible) && rules[p.id] && subtotal !== null && subtotal >= p.minimumCents)
  const options = [null, ...candidates].map(promo => {
    const rule = promo ? rules[promo.id] : {}
    const discount = subtotal === null ? 0 : Math.min(subtotal, rule.fixed ?? Math.min(Math.round(subtotal * (rule.percent ?? 0) / 100), rule.cap ?? Infinity))
    const deliveryFee = rule.deliveryFree ? 0 : delivery
    const taxable = subtotal === null ? null : subtotal - discount + (deliveryFee ?? 0) + (service ?? 0)
    const tax = taxable === null ? null : Math.round(taxable * 0.15)
    const total = taxable === null || deliveryFee === null || service === null ? null : taxable + tax!
    return { promo, discount, delivery: deliveryFee, service, tax, total, savings: discount + (rule.deliveryFree ? delivery ?? 0 : 0) }
  })
  // Never stack offers. Choose the largest saving among confirmed or assumed-eligible offers.
  options.sort((a, b) => b.savings - a.savings)
  return { ...options[0], available }
}
