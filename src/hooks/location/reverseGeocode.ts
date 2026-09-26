/**
 * reverseGeocode — looks up a street label for a dropped pin via Nominatim (OSM).
 * Lives in `hooks/location/`; the only place that talks to the geocoder.
 * Returns null when the lookup fails so callers can still keep the coordinates.
 */
export interface ReverseGeocodeResult {
  address: string
  city: string
  region: string
  postalCode: string
}

interface NominatimAddress {
  house_number?: string
  road?: string
  city?: string
  town?: string
  village?: string
  hamlet?: string
  state?: string
  postcode?: string
}

interface NominatimReverse {
  display_name?: string
  address?: NominatimAddress
}

function streetLine(parts: NominatimAddress | undefined): string {
  if (!parts) return ''
  return [parts.house_number, parts.road].filter(Boolean).join(' ')
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')

  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!response.ok) return null

  const data = (await response.json()) as NominatimReverse
  const parts = data.address
  const address = streetLine(parts) || data.display_name?.split(',')[0]?.trim() || ''
  if (!address) return null

  return {
    address,
    city: parts?.city || parts?.town || parts?.village || parts?.hamlet || '',
    region: parts?.state || '',
    postalCode: parts?.postcode || '',
  }
}
