import { useCallback, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { CompareResponseWire } from '@/types/compare-wire'
import { compareFiltersWire, getDefaultPreferences } from '@/hooks/account/comparePrefsStore'

export interface CompareFormState {
  placeId: string
  dishId: string
  quantity: number
  lat: string
  lng: string
  userId: string
}

export const defaultCompareForm: CompareFormState = {
  placeId: 'pl_demo',
  dishId: 'dish_burger',
  quantity: 1,
  lat: '45.9458',
  lng: '-66.6414',
  userId: '',
}

export function useCompare() {
  const [form, setForm] = useState<CompareFormState>(defaultCompareForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CompareResponseWire | null>(null)

  const runCompare = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const lat = Number.parseFloat(form.lat)
      const lng = Number.parseFloat(form.lng)
      const defaults = getDefaultPreferences()
      const body = {
        place_id: form.placeId,
        user_id: form.userId || undefined,
        fulfillment_context: {
          mode: 'delivery',
          dropoff: { latitude: lat, longitude: lng, label: 'UNBF' },
        },
        basket: {
          lines: [{ dish_id: form.dishId, quantity: form.quantity }],
        },
        filters: compareFiltersWire(defaults),
        memberships: defaults.memberships,
      }
      const { data } = await axios.post<CompareResponseWire>('/api/v1/compare', body)
      setResult(data)
    } catch (err: unknown) {
      setError(extractAxiosError(err, 'compare failed'))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [form])

  const resetCompare = useCallback(() => {
    setForm(defaultCompareForm)
    setResult(null)
    setError(null)
  }, [])

  return { form, setForm, loading, error, result, runCompare, resetCompare }
}
