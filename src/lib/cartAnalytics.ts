import axios from 'axios'

export type CartEventKind = 'suggestion_add' | 'provider_swap' | 'handoff'

export function trackCartEvent(kind: CartEventKind, details: {
  itemId?: string
  providerId?: string
  targetURL?: string
  restaurantId?: string
  totalCents?: number
  currency?: string
  addressId?: string
} = {}) {
  void axios.post('/api/v1/cart/events', { kind, ...details }).catch(() => { /* analytics must never block ordering */ })
}
