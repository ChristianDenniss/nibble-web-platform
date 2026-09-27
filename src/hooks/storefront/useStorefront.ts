/**
 * useStorefront — loads domain entities the pages lay out against.
 * Entity types are generated from go-data-model. This hook only composes them.
 */
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { Account, ActivePromotion, Cart, Category, Cuisine, Item, Offer, Order, Provider, Restaurant } from '@/generated/data-model'
import { useAuth } from '@/hooks/auth/authStore'
import {
  useDeliveryLocationState,
  type DeliveryLocationState,
} from '@/hooks/location/deliveryLocationStore'

export interface StorefrontData {
  account: Account
  providers: Provider[]
  categories: Category[]
  cuisines: Cuisine[]
  restaurants: Restaurant[]
  items: Item[]
  offers: Offer[]
  deals: ActivePromotion[]
  cart: Cart
  orders: Order[]
  coverage?: Record<string, RestaurantCoverage>
}

export interface RestaurantCoveragePath {
  providerId: string
  sourceStoreId: string
  deliverable: boolean
  status: 'covered' | 'unavailable' | 'unknown'
  reason: string
}

export interface RestaurantCoverage {
  restaurantId: string
  paths: RestaurantCoveragePath[]
}

export interface StorefrontState {
  loading: boolean
  data: StorefrontData | null
  error: string | null
  reload: () => void
}

interface UseStorefrontOptions {
  lightweight?: boolean
  includeRestaurants?: boolean
}

interface RestaurantPageResponse {
  data: Restaurant[]
}

function applyDeliveryLocation(data: StorefrontData, delivery: DeliveryLocationState): StorefrontData {
  const addresses = delivery.sessionAddress
    ? [delivery.sessionAddress, ...data.account.addresses.filter((address) => address.id !== delivery.sessionAddress?.id)]
    : data.account.addresses

  const fallbackId = addresses.find((address) => address.current)?.id ?? addresses[0]?.id ?? null
  const selectedId = delivery.selectedId && addresses.some((address) => address.id === delivery.selectedId)
    ? delivery.selectedId
    : fallbackId

  return {
    ...data,
    account: {
      ...data.account,
      addresses: addresses.map((address) => ({ ...address, current: address.id === selectedId })),
    },
  }
}

export function useStorefront(options: UseStorefrontOptions = {}): StorefrontState {
  const delivery = useDeliveryLocationState()
  const accountId = useAuth().account?.id ?? null
  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState<Omit<StorefrontState, 'reload'>>({
    loading: true,
    data: null,
    error: null,
  })
  const [coverage, setCoverage] = useState<Record<string, RestaurantCoverage>>({})

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setState((current) => ({ ...current, loading: true, error: null }))

    const bootstrapRequest = axios.get<StorefrontData>('/api/v1/storefront', {
      params: options.lightweight ? { lightweight: true } : undefined,
    })
    const restaurantsRequest = options.includeRestaurants
      ? axios.get<RestaurantPageResponse>('/api/v1/restaurants', { params: { page: 1, pageSize: 100 } })
      : Promise.resolve(null)

    Promise.all([bootstrapRequest, restaurantsRequest])
      .then(([response, restaurantsResponse]) => {
        if (cancelled) return
        const restaurants = restaurantsResponse?.data.data ?? response.data.restaurants ?? []
        setState({
          loading: false,
          data: {
            ...response.data,
            providers: response.data.providers ?? [],
            categories: response.data.categories ?? [],
            cuisines: response.data.cuisines ?? [],
            restaurants,
            items: response.data.items ?? [],
            offers: response.data.offers ?? [],
            deals: response.data.deals ?? [],
            orders: response.data.orders ?? [],
          },
          error: null,
        })
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
  }, [reloadToken, accountId, options.lightweight, options.includeRestaurants])

  const visibleData = state.data ? applyDeliveryLocation(state.data, delivery) : null
  const selectedAddress = visibleData ? currentAddress(visibleData) : undefined

  useEffect(() => {
    if (!state.data || !selectedAddress || state.data.restaurants.length === 0) {
      setCoverage({})
      return
    }
    let cancelled = false
    const params = new URLSearchParams({
      restaurant_ids: state.data.restaurants.map((restaurant) => restaurant.id).join(','),
      latitude: String(selectedAddress.location.latitude),
      longitude: String(selectedAddress.location.longitude),
    })
    axios.get<{ restaurants: RestaurantCoverage[] }>(`/api/v1/serviceability/restaurants?${params.toString()}`)
      .then((response) => {
        if (cancelled) return
        setCoverage(Object.fromEntries(response.data.restaurants.map((entry) => [entry.restaurantId, entry])))
      })
      .catch(() => {
        if (!cancelled) setCoverage({})
      })
    return () => { cancelled = true }
  }, [state.data, selectedAddress?.id, selectedAddress?.location.latitude, selectedAddress?.location.longitude])

  return {
    ...state,
    reload,
    data: visibleData ? { ...visibleData, coverage } : null,
  }
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
  // Provider availability is a serviceability/purchase-path relationship,
  // not a consequence of having an item price observation. Offers remain a
  // fallback for screens where coverage has not loaded yet.
  const ids = new Set([
    ...data.offers.filter((offer) => offer.restaurantId === restaurantId).map((offer) => offer.providerId),
    ...(data.coverage?.[restaurantId]?.paths.map((path) => path.providerId) ?? []),
  ])
  return data.providers.filter((provider) => ids.has(provider.id))
}

export function restaurantCoverage(data: StorefrontData, restaurantId: string): RestaurantCoverage | undefined {
  return data.coverage?.[restaurantId]
}

export function coveredProviderIds(data: StorefrontData, restaurantId: string): Set<string> | null {
  const coverage = restaurantCoverage(data, restaurantId)
  if (!coverage) return null
  return new Set(coverage.paths.filter((path) => path.status === 'covered').map((path) => path.providerId))
}

export function offersForItem(data: StorefrontData, itemId: string) {
  return data.offers.filter((offer) => offer.menuItemId === itemId)
}

export function itemsForRestaurant(data: StorefrontData, restaurantId: string) {
  return data.items.filter((item) => item.restaurantId === restaurantId)
}

