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
    let attempt = 0
    const maxAttempts = 8

    const probe = () => {
      axios
        .get<string>('/health', { validateStatus: () => true })
        .then((response) => {
          if (cancelled) return
          if (response.status === 200) {
            setState({ loading: false, ok: true, status: 200, message: '200 success' })
            return
          }
          retry(String(response.status), response.status)
        })
        .catch((err: unknown) => {
          if (cancelled) return
          retry(extractAxiosError(err, 'health check failed'), null)
        })
    }

    const retry = (message: string, status: number | null) => {
      attempt += 1
      if (attempt >= maxAttempts) {
        setState({ loading: false, ok: false, status, message })
        return
      }
      window.setTimeout(probe, 500)
    }

    probe()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
