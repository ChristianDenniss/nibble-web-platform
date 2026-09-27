/**
 * enableMockDev — DEV-only axios adapter that serves the in-memory storefront catalog.
 * Call once from main.tsx. Production builds never import this file.
 *
 * Why this exists: UI work should not require seeding api-engine or Postgres.
 * Hooks still call /api/* as they will in production; this adapter short-circuits
 * those calls before they leave the browser.
 *
 * Turn it off with VITE_MOCK=0 to talk to the real API during `vite dev`.
 */
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { isMockableRequest, resolveMock } from './handlers'

let installed = false

export function isMockDevEnabled(): boolean {
  return installed
}

export function enableMockDev(): void {
  if (!import.meta.env.DEV && import.meta.env.VITE_DEMO !== '1') return
  if (import.meta.env.VITE_MOCK === '0') return
  if (installed) return
  installed = true

  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Authentication always uses the API unless explicitly isolated for UI testing.
    const pathname = new URL(config.url ?? '/', window.location.origin).pathname
    if (pathname.startsWith('/api/v1/auth/') && import.meta.env.VITE_AUTH_MODE !== 'mock') return config
    if (!isMockableRequest(config)) return config

    config.adapter = (cfg) => {
      const result = resolveMock(cfg)
      if (!result) {
        return Promise.reject(new Error(`mock-dev: unmatched ${cfg.method} ${cfg.url}`))
      }

      const response: AxiosResponse = {
        data: result.data,
        status: result.status,
        statusText: result.status === 200 ? 'OK' : 'Error',
        headers: { 'x-mock-dev': '1' },
        config: cfg,
        request: {},
      }

      const validateStatus = cfg.validateStatus ?? ((status: number) => status >= 200 && status < 300)
      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          if (validateStatus(result.status)) {
            resolve(response)
            return
          }
          reject(new AxiosError(
            `Request failed with status code ${result.status}`,
            result.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
            cfg,
            {},
            response,
          ))
        }, 80)
      })
    }

    return config
  })

  console.info('[mock-dev] catalog adapter installed — set VITE_MOCK=0 to use api-engine')
}
