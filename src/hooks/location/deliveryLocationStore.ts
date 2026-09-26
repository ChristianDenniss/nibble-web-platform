/**
 * deliveryLocationStore — session delivery address (which saved address is current,
 * plus an optional GPS pin when the device location is not near a saved one).
 * Lives in `hooks/location/`; `useStorefront` overlays this onto catalog addresses
 * so every page sees the same current flag without a write API yet.
 */
import { useSyncExternalStore } from 'react'
import type { SavedAddress } from '@/generated/data-model'

export const SESSION_GPS_ADDRESS_ID = 'addr_session_gps'

const STORAGE_KEY = 'nibble.deliveryLocation'

export interface DeliveryLocationState {
  selectedId: string | null
  sessionAddress: SavedAddress | null
}

const EMPTY: DeliveryLocationState = { selectedId: null, sessionAddress: null }

let state: DeliveryLocationState = EMPTY
const listeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  state = readStorage()
}

function emit() {
  listeners.forEach((listener) => listener())
}

function persist(next: DeliveryLocationState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* private mode / quota — selection still works in-memory */
  }
}

function readStorage(): DeliveryLocationState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<DeliveryLocationState>
    return {
      selectedId: typeof parsed.selectedId === 'string' ? parsed.selectedId : null,
      sessionAddress: parsed.sessionAddress ?? null,
    }
  } catch {
    return EMPTY
  }
}

function setState(next: DeliveryLocationState) {
  state = next
  persist(next)
  emit()
}

export function getDeliveryLocationState(): DeliveryLocationState {
  return state
}

export function selectDeliveryAddress(id: string) {
  setState({ ...state, selectedId: id })
}

export function setGpsDeliveryAddress(coords: { latitude: number; longitude: number }) {
  const sessionAddress: SavedAddress = {
    id: SESSION_GPS_ADDRESS_ID,
    label: 'Current location',
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
      address: 'Current location',
      city: '',
      region: '',
      postalCode: '',
    },
    current: true,
  }
  setState({ selectedId: SESSION_GPS_ADDRESS_ID, sessionAddress })
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function useDeliveryLocationState(): DeliveryLocationState {
  return useSyncExternalStore(subscribe, getDeliveryLocationState, () => EMPTY)
}
