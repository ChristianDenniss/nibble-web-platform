/**
 * useAccountAddresses — saved-address mutations against api-engine.
 * Session pins (GPS / map drop) stay in deliveryLocationStore until user_dropoffs write exists.
 */
import { useCallback, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { SavedAddress } from '@/generated/data-model'
import {
  clearSessionPin,
  getDeliveryLocationState,
  selectDeliveryAddress,
  SESSION_PIN_ADDRESS_ID,
} from '@/hooks/location/deliveryLocationStore'

/** Matches api-engine DEFAULT_ACCOUNT_ID for local dev. */
export const STOREFRONT_ACCOUNT_ID = 'acct_dev'

function savedAddressPath(addressId: string) {
  return `/api/v1/accounts/${encodeURIComponent(STOREFRONT_ACCOUNT_ID)}/addresses/${encodeURIComponent(addressId)}`
}

export function useAccountAddresses(reloadStorefront: () => void) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickAddress = useCallback(
    async (address: SavedAddress) => {
      setError(null)
      if (address.id === SESSION_PIN_ADDRESS_ID) {
        selectDeliveryAddress(address.id)
        return true
      }
      setBusy(true)
      try {
        await axios.put(`${savedAddressPath(address.id)}/current`)
        selectDeliveryAddress(null)
        reloadStorefront()
        return true
      } catch (err: unknown) {
        setError(extractAxiosError(err, 'Could not update delivery address'))
        return false
      } finally {
        setBusy(false)
      }
    },
    [reloadStorefront],
  )

  const removeAddress = useCallback(
    async (addressId: string) => {
      setError(null)
      if (addressId === SESSION_PIN_ADDRESS_ID) {
        clearSessionPin()
        reloadStorefront()
        return true
      }
      setBusy(true)
      try {
        await axios.delete(savedAddressPath(addressId))
        if (getDeliveryLocationState().selectedId === addressId) {
          selectDeliveryAddress(null)
        }
        reloadStorefront()
        return true
      } catch (err: unknown) {
        setError(extractAxiosError(err, 'Could not remove address'))
        return false
      } finally {
        setBusy(false)
      }
    },
    [reloadStorefront],
  )

  return { pickAddress, removeAddress, busy, error }
}
