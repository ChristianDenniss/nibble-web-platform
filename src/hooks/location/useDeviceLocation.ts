/**
 * useDeviceLocation — asks the browser for GPS, then either selects the nearest
 * saved address or stores a session GPS pin. UI-only until a geocoding API exists.
 * Lives in `hooks/location/`.
 */
import { useState } from 'react'
import type { SavedAddress } from '@/generated/data-model'
import {
  SESSION_GPS_ADDRESS_ID,
  selectDeliveryAddress,
  setGpsDeliveryAddress,
} from '@/hooks/location/deliveryLocationStore'
import { notify } from '@/utils/notify'

const NEARBY_KM = 50

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function distanceKm(address: SavedAddress, latitude: number, longitude: number): number {
  const lat1 = address.location.latitude
  const lng1 = address.location.longitude
  if (!Number.isFinite(lat1) || !Number.isFinite(lng1)) return Number.POSITIVE_INFINITY
  const dLat = toRad(latitude - lat1)
  const dLng = toRad(longitude - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(latitude)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)))
}

function readPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(new Error(error.message || 'Location permission denied')),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  })
}

export function useDeviceLocation() {
  const [locating, setLocating] = useState(false)

  async function locate(addresses: SavedAddress[]): Promise<boolean> {
    setLocating(true)
    try {
      const coords = await readPosition()
      const nearby = addresses
        .filter((address) => address.id !== SESSION_GPS_ADDRESS_ID)
        .map((address) => ({ address, km: distanceKm(address, coords.latitude, coords.longitude) }))
        .sort((a, b) => a.km - b.km)[0]

      if (nearby && nearby.km <= NEARBY_KM) {
        selectDeliveryAddress(nearby.address.id)
        notify.success(`Using ${nearby.address.label || nearby.address.location.address}`)
        return true
      }

      setGpsDeliveryAddress({ latitude: coords.latitude, longitude: coords.longitude })
      notify.success('Using your current location')
      return true
    } catch {
      notify.error('Could not read your location. Check browser permissions.')
      return false
    } finally {
      setLocating(false)
    }
  }

  return { locating, locate }
}
