import { useCallback, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'

export interface SourceStoreWire {
  id: string
  channelId: string
  externalStoreId: string
  name: string
  location: { latitude: number; longitude: number; address: string }
  phone: string
}

interface ChannelStoresResponse {
  stores: SourceStoreWire[]
}

export function useChannelStores() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stores, setStores] = useState<SourceStoreWire[] | null>(null)

  const load = useCallback(async (channelId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get<ChannelStoresResponse>(
        `/api/v1/channels/${encodeURIComponent(channelId)}/source-stores`,
      )
      setStores(data.stores ?? [])
    } catch (err: unknown) {
      setError(extractAxiosError(err, 'failed to list source stores'))
      setStores(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, stores, load }
}
