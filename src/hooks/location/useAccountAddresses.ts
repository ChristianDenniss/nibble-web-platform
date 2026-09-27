/**
 * useAccountAddresses — saved-address mutations against api-engine for the signed-in account.
 * Guests only change the delivery address locally; session pins (GPS / map drop) stay in
 * deliveryLocationStore until user_dropoffs write exists.
 */
import { useCallback, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { SavedAddress } from '@/generated/data-model'
import { useAuth } from '@/hooks/auth/authStore'
import {
  clearSessionPin,
  getDeliveryLocationState,
  selectDeliveryAddress,
  SESSION_PIN_ADDRESS_ID,
} from '@/hooks/location/deliveryLocationStore'

function savedAddressPath(accountId: string, addressId: string) {
  return `/api/v1/accounts/${encodeURIComponent(accountId)}/addresses/${encodeURIComponent(addressId)}`
}

export function useAccountAddresses(reloadStorefront: () => void) {
  const accountId = useAuth().account?.id ?? null
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickAddress = useCallback(
    async (address: SavedAddress) => {
      setError(null)
      if (address.id === SESSION_PIN_ADDRESS_ID || !accountId) {
        selectDeliveryAddress(address.id)
        return true
      }
      setBusy(true)
      try {
        await axios.put(`${savedAddressPath(accountId, address.id)}/current`)
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
    [accountId, reloadStorefront],
  )

  const removeAddress = useCallback(
    async (addressId: string) => {
      setError(null)
      if (addressId === SESSION_PIN_ADDRESS_ID) {
        clearSessionPin()
        reloadStorefront()
        return true
      }
      if (!accountId) {
        setError('Log in to manage saved addresses.')
        return false
      }
      setBusy(true)
      try {
        await axios.delete(savedAddressPath(accountId, addressId))
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
    [accountId, reloadStorefront],
  )

  return { pickAddress, removeAddress, busy, error }
}
