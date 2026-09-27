/** Project assumptions, not scraped quotes or advertised provider rates.
 * Use the same baseline until address-specific checkout quotes are available.
 */
export const deliveryEstimates: Record<string, number> = {
  prov_ubereats: 399,
  prov_doordash: 399,
  prov_skip: 399,
}
export function estimateFees(providerId: string, subtotal: number | null, pickupOnly = false) {
  if (pickupOnly) return { delivery: 0, service: 0 }
  if (!(providerId in deliveryEstimates)) return { delivery: null, service: null }
  return { delivery: deliveryEstimates[providerId], service: subtotal === null ? null : Math.round(subtotal * 0.10) }
}
