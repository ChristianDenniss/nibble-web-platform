/**
 * authStore — who is signed in. The session itself is an HttpOnly cookie set by api-engine;
 * this store only mirrors GET /v1/auth/me so pages can branch on guest vs signed in.
 * Lives in `hooks/auth/`; `useAuth()` loads the session once per app load.
 */
import { useEffect, useSyncExternalStore } from 'react'
import axios from 'axios'

export interface AuthAccount {
  id: string
  name: string
  email: string
}

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

export interface AuthState {
  status: AuthStatus
  account: AuthAccount | null
}

export type SsoProvider = 'google' | 'apple'

interface SessionResponse {
  account: AuthAccount | null
}

const LOADING: AuthState = { status: 'loading', account: null }

let state: AuthState = LOADING
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

function setAccount(account: AuthAccount | null) {
  state = account ? { status: 'authenticated', account } : { status: 'guest', account: null }
  listeners.forEach((listener) => listener())
}

export function getAuthState(): AuthState {
  return state
}

export function loadSession(): Promise<void> {
  loading ??= axios
    .get<SessionResponse>('/api/v1/auth/me')
    .then((response) => setAccount(response.data.account))
    .catch(() => setAccount(null))
  return loading
}

export async function login(email: string, password: string): Promise<AuthAccount> {
  const { data } = await axios.post<SessionResponse>('/api/v1/auth/login', { email, password })
  setAccount(data.account)
  return data.account as AuthAccount
}

export async function signUp(name: string, email: string, password: string): Promise<AuthAccount> {
  const { data } = await axios.post<SessionResponse>('/api/v1/auth/signup', { name, email, password })
  setAccount(data.account)
  return data.account as AuthAccount
}

export async function logout(): Promise<void> {
  try {
    await axios.post('/api/v1/auth/logout')
  } finally {
    setAccount(null)
  }
}

/** Full-page URL that starts the provider's OAuth flow on api-engine. */
export function ssoStartUrl(provider: SsoProvider): string {
  const base = (axios.defaults.baseURL ?? '').replace(/\/$/, '')
  return `${base}/api/v1/auth/oauth/${provider}/start`
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function useAuth(): AuthState {
  useEffect(() => {
    void loadSession()
  }, [])
  return useSyncExternalStore(subscribe, getAuthState, () => LOADING)
}
