import { useCallback, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { CompareResponseWire } from '@/types/compare-wire'

export interface CompareFormState {
  placeId: string
  dishId: string
  quantity: number
  lat: string
  lng: string
  userId: string
}

const defaultForm: CompareFormState = {
  placeId: 'pl_demo',
  dishId: 'dish_burger',
  quantity: 1,
  lat: '43.6532',
  lng: '-79.3832',
  userId: '',
}

export function useCompare() {
  const [form, setForm] = useState<CompareFormState>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CompareResponseWire | null>(null)

  const runCompare = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const lat = Number.parseFloat(form.lat)
      const lng = Number.parseFloat(form.lng)
      const body = {
        place_id: form.placeId,
        user_id: form.userId || undefined,
        fulfillment_context: {
          mode: 'delivery',
          dropoff: { latitude: lat, longitude: lng, label: 'Compare' },
        },
        basket: {
          lines: [{ dish_id: form.dishId, quantity: form.quantity }],
        },
        filters: { willing_to_use_aggregator: true },
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

  return { form, setForm, loading, error, result, runCompare }
}
