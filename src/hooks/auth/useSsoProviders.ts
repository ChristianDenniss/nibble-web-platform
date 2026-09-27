/**
 * useSsoProviders — which sign-in providers api-engine has credentials for.
 * Buttons for unconfigured providers render disabled instead of failing mid-redirect.
 */
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { SsoProvider } from '@/hooks/auth/authStore'

interface ProvidersResponse {
  providers: { id: SsoProvider; enabled: boolean }[]
}

export function useSsoProviders(): Record<SsoProvider, boolean> {
  const [enabled, setEnabled] = useState<Record<SsoProvider, boolean>>({ google: false, apple: false })

  useEffect(() => {
    let cancelled = false
    axios
      .get<ProvidersResponse>('/api/v1/auth/providers')
      .then((response) => {
        if (cancelled) return
        const next = { google: false, apple: false }
        response.data.providers.forEach((provider) => {
          next[provider.id] = provider.enabled
        })
        setEnabled(next)
      })
      .catch(() => {
        /* leave every provider disabled */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return enabled
}
