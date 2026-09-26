/**
 * useDropPin — drops a session delivery pin at map coordinates, filling the street
 * label via reverse geocode when Nominatim answers. Lives in `hooks/location/`.
 */
import { useState } from 'react'
import { setSessionPin } from '@/hooks/location/deliveryLocationStore'
import { reverseGeocode } from '@/hooks/location/reverseGeocode'

export function useDropPin() {
  const [dropping, setDropping] = useState(false)

  async function drop(coords: { latitude: number; longitude: number }): Promise<void> {
    setDropping(true)
    try {
      const geo = await reverseGeocode(coords.latitude, coords.longitude)
      setSessionPin({
        latitude: coords.latitude,
        longitude: coords.longitude,
        label: geo?.address || 'Dropped pin',
        address: geo?.address || 'Dropped pin',
        city: geo?.city,
        region: geo?.region,
        postalCode: geo?.postalCode,
      })
    } catch {
      setSessionPin({
        latitude: coords.latitude,
        longitude: coords.longitude,
        label: 'Dropped pin',
        address: 'Dropped pin',
      })
    } finally {
      setDropping(false)
    }
  }

  return { dropping, drop }
}
