import { useEffect, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'

export interface HealthState {
  loading: boolean
  ok: boolean
  status: number | null
  message: string
}

export function useFetchHealth(): HealthState {
  const [state, setState] = useState<HealthState>({
    loading: true,
    ok: false,
    status: null,
    message: 'checking /health',
  })

  useEffect(() => {
    let cancelled = false

    axios
      .get<string>('/health', { validateStatus: () => true })
      .then((response) => {
        if (cancelled) return
        if (response.status === 200) {
          setState({ loading: false, ok: true, status: 200, message: '200 success' })
          return
        }
        setState({
          loading: false,
          ok: false,
          status: response.status,
          message: String(response.status),
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          loading: false,
          ok: false,
          status: null,
          message: extractAxiosError(err, 'health check failed'),
        })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
