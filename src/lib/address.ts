/**
 * address — display helpers for generated Location / SavedAddress.
 * Do not invent parallel address shapes; format the domain types only.
 */
import type { Location, SavedAddress } from '@/generated/data-model'

/** Fallback map center (UNBF, Fredericton) when the selected address has no coordinates. */
export const DEFAULT_MAP_CENTER = { latitude: 45.9458, longitude: -66.6414 }

export function formatLocation(location: Location): string {
  return [location.address, location.city, location.region, location.postalCode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')
}

export function formatLocationShort(location: Location): string {
  return location.address.trim() || location.city.trim() || 'Set location'
}

export function addressTriggerLabel(address: SavedAddress | null | undefined, fallback = 'Set location'): string {
  if (!address) return fallback
  return address.label.trim() || address.location.city.trim() || formatLocationShort(address.location)
}

export function addressesMatchQuery(address: SavedAddress, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    address.label,
    address.location.address,
    address.location.city,
    address.location.region,
    address.location.postalCode,
  ].join(' ').toLowerCase()
  return haystack.includes(needle)
}
