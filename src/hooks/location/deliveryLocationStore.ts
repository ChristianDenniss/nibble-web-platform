/**
 * deliveryLocationStore — session delivery address (which saved address is current,
 * plus an optional session pin from GPS or a dropped map marker).
 * Lives in `hooks/location/`; `useStorefront` overlays this onto catalog addresses
 * so every page sees the same current flag without a write API yet.
 */
import { useSyncExternalStore } from 'react'
import type { SavedAddress } from '@/generated/data-model'

export const SESSION_PIN_ADDRESS_ID = 'addr_session_gps'
export const SESSION_GPS_ADDRESS_ID = SESSION_PIN_ADDRESS_ID

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

export function selectDeliveryAddress(id: string | null) {
  setState({ ...state, selectedId: id })
}

export interface SessionPinInput {
  latitude: number
  longitude: number
  label?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
}

export function setSessionPin(input: SessionPinInput) {
  const label = input.label?.trim() || 'Dropped pin'
  const address = input.address?.trim() || label
  const sessionAddress: SavedAddress = {
    id: SESSION_PIN_ADDRESS_ID,
    label,
    location: {
      latitude: input.latitude,
      longitude: input.longitude,
      address,
      city: input.city?.trim() ?? '',
      region: input.region?.trim() ?? '',
      postalCode: input.postalCode?.trim() ?? '',
    },
    current: true,
  }
  setState({ selectedId: SESSION_PIN_ADDRESS_ID, sessionAddress })
}

export function clearSessionPin() {
  if (state.selectedId === SESSION_PIN_ADDRESS_ID) {
    setState({ selectedId: null, sessionAddress: null })
    return
  }
  setState({ ...state, sessionAddress: null })
}

export function setGpsDeliveryAddress(coords: { latitude: number; longitude: number }) {
  setSessionPin({
    latitude: coords.latitude,
    longitude: coords.longitude,
    label: 'Current location',
    address: 'Current location',
  })
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
