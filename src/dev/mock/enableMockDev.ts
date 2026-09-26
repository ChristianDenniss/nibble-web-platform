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
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { isMockableRequest, resolveMock } from './handlers'

let installed = false

export function isMockDevEnabled(): boolean {
  return installed
}

export function enableMockDev(): void {
  if (!import.meta.env.DEV) return
  if (import.meta.env.VITE_MOCK === '0') return
  if (installed) return
  installed = true

  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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

      return new Promise((resolve) => {
        window.setTimeout(() => resolve(response), 80)
      })
    }

    return config
  })

  console.info('[mock-dev] catalog adapter installed — set VITE_MOCK=0 to use api-engine')
}
