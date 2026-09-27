import type { Location, Restaurant, SavedAddress } from '@/generated/data-model'

export type CoverageStatus = 'covered' | 'unavailable' | 'unknown'

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function distanceKm(from: Location, to: Location): number | null {
  if (![from.latitude, from.longitude, to.latitude, to.longitude].every(Number.isFinite)) return null
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const latitudeFactor = Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude))
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    latitudeFactor * Math.sin(longitudeDelta / 2) ** 2
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(haversine)))
}

export function restaurantDistanceKm(restaurant: Restaurant, address?: SavedAddress): number | null {
  return address ? distanceKm(restaurant.location, address.location) : null
}

