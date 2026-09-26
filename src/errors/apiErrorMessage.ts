import axios from 'axios'

/** Backend errors use `{ error: string }`; some legacy paths use `message`. */
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; message?: string } | undefined
    return data?.error ?? data?.message ?? err.message
  }
  return fallback
}
