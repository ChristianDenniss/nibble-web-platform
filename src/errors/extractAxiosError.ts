import axios from 'axios'
import { STATUS_MESSAGES } from './statusMessages'

export function extractAxiosError(err: unknown, fallback = 'Request failed.'): string {
  if (!axios.isAxiosError(err)) return fallback
  if (!err.response) return 'Network error; check your connection.'

  // Prefer our own backend's message (AppError subclasses always carry a specific, human-
  // written reason) over the generic per-status text below - only fall back to that table
  // when the backend didn't give us anything more specific to say.
  const data = err.response.data as { error?: string; details?: Array<{ message?: string }> } | undefined
  const backendMessage = data?.details?.[0]?.message ?? data?.error
  if (backendMessage) {
    return backendMessage.includes('. ') ? backendMessage.split('. ')[0] + '.' : backendMessage.substring(0, 150)
  }

  const status = err.response.status
  if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]

  return err.message ?? fallback
}
