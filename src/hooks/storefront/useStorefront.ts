/**
 * useStorefront — loads domain entities the pages lay out against.
 * Entity types are generated from go-data-model. This hook only composes them.
 */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { Account, Cart, Category, Cuisine, Item, Offer, Order, Provider, Restaurant } from '@/generated/data-model'

export interface StorefrontData {
  account: Account
  providers: Provider[]
  categories: Category[]
  cuisines: Cuisine[]
  restaurants: Restaurant[]
  items: Item[]
  offers: Offer[]
  cart: Cart
  orders: Order[]
}

export interface StorefrontState {
  loading: boolean
  data: StorefrontData | null
  error: string | null
}

export function useStorefront(): StorefrontState {
  const [state, setState] = useState<StorefrontState>({
    loading: true,
    data: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    axios
      .get<StorefrontData>('/api/v1/storefront')
      .then((response) => {
        if (cancelled) return
        setState({ loading: false, data: response.data, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          loading: false,
          data: null,
          error: extractAxiosError(err, 'storefront failed to load'),
        })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function currentAddress(data: StorefrontData) {
  return data.account.addresses.find((address) => address.current) ?? data.account.addresses[0]
}

export function lowestOfferCents(data: StorefrontData, restaurantId: string): number | null {
  const prices = data.offers
    .filter((offer) => offer.restaurantId === restaurantId)
    .map((offer) => offer.price.amountCents)
  if (prices.length === 0) return null
  return Math.min(...prices)
}

export function restaurantEta(data: StorefrontData, restaurantId: string): { min: number; max: number } | null {
  const minutes = data.offers
    .filter((offer) => offer.restaurantId === restaurantId && offer.estimatedMinutes > 0)
    .map((offer) => offer.estimatedMinutes)
  if (minutes.length === 0) return null
  return { min: Math.min(...minutes), max: Math.max(...minutes) }
}

export function restaurantProviders(data: StorefrontData, restaurantId: string) {
  const ids = new Set(
    data.offers.filter((offer) => offer.restaurantId === restaurantId).map((offer) => offer.providerId),
  )
  return data.providers.filter((provider) => ids.has(provider.id))
}

export function offersForItem(data: StorefrontData, itemId: string) {
  return data.offers.filter((offer) => offer.menuItemId === itemId)
}

export function itemsForRestaurant(data: StorefrontData, restaurantId: string) {
  return data.items.filter((item) => item.restaurantId === restaurantId)
}
