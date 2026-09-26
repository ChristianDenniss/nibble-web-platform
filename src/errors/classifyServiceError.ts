import axios from 'axios'

/** Full-page branded outages — not per-request toasts. 401/403/4xx are not outages. */
export type ServiceErrorKind = 'timeout' | 'unavailable' | 'unexpected'

export function classifyServiceError(err: unknown): ServiceErrorKind | null {
  if (!axios.isAxiosError(err)) return null
  if (!err.response) {
    const msg = (err.message ?? '').toLowerCase()
    if (err.code === 'ECONNABORTED' || msg.includes('timeout')) return 'timeout'
    return 'unavailable'
  }
  const status = err.response.status
  if (status === 408 || status === 504) return 'timeout'
  if (status === 502 || status === 503) return 'unavailable'
  if (status >= 500) return 'unexpected'
  return null
}
