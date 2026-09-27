/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** Set to "0" to hit api-engine in `vite dev` instead of the in-memory mock catalog. */
  readonly VITE_MOCK?: string
  /** Real cookie sessions by default; mock is only for isolated UI development. */
  readonly VITE_AUTH_MODE?: 'mock' | 'live'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
