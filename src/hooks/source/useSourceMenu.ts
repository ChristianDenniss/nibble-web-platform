import { useCallback, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'

export interface SourceMenuBrowseWire {
  store: {
    id: string
    channelId: string
    name: string
  }
  menu: {
    id: string
    fulfillmentMode: string
    deliveryExecutor: string
  }
  categories: Array<{
    category: { id: string; name: string }
    items: Array<{
      id: string
      name: string
      imageURL: string
      price: { amountCents: number; currency: string }
    }>
  }>
}

export function useSourceMenu() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SourceMenuBrowseWire | null>(null)

  const load = useCallback(async (storeId: string, fulfillmentMode: string, deliveryExecutor = '') => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ fulfillment_mode: fulfillmentMode })
      if (deliveryExecutor) params.set('delivery_executor', deliveryExecutor)
      const { data: body } = await axios.get<SourceMenuBrowseWire>(
        `/api/v1/source-stores/${encodeURIComponent(storeId)}/menu?${params}`,
      )
      setData(body)
    } catch (err: unknown) {
      setError(extractAxiosError(err, 'failed to load source menu'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { loading, error, data, load, clear }
}
