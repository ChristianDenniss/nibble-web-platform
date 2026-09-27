/**
 * Mock /api/v1/auth/* for the DEV adapter. The "cookie" is localStorage so reloads stay signed in.
 * Demo login: aottgpvp@gmail.com / christian (same as the seeded root account).
 */
import { mockAccount } from './catalog'
import type { MockResult } from './handlers'

interface MockUser {
  id: string
  name: string
  email: string
  password: string
  role: string
}

interface MockAuthState {
  sessionUserId: string | null
  users: MockUser[]
}

const STORAGE_KEY = 'nibble.mockAuth'
const DEMO_USER: MockUser = { id: 'acct_aottgpvp_root', name: 'Aottg', email: 'aottgpvp@gmail.com', password: 'christian', role: 'root' }

function read(): MockAuthState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as MockAuthState | null
    if (parsed) {
      const hasRoot = parsed.users.some((user) => user.email === DEMO_USER.email)
      const users = hasRoot ? parsed.users : [...parsed.users, DEMO_USER]
      const sessionUserId = parsed.sessionUserId === 'acct_dev' ? DEMO_USER.id : parsed.sessionUserId
      return { ...parsed, users, sessionUserId }
    }
  } catch {
    /* fall through to a fresh state */
  }
  return { sessionUserId: null, users: [DEMO_USER] }
}

function write(state: MockAuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode — session lasts until reload */
  }
}

function publicAccount(user: MockUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

function body(data: unknown): Record<string, string> {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Record<string, string>
    } catch {
      return {}
    }
  }
  return (data ?? {}) as Record<string, string>
}

/** The signed-in mock user, overlaid onto the catalog account so the UI shows who logged in. */
export function mockSessionAccount() {
  const state = read()
  const user = state.users.find((entry) => entry.id === state.sessionUserId)
  return user ? { ...mockAccount, ...publicAccount(user) } : mockAccount
}

export function resolveAuthMock(method: string, path: string, data: unknown): MockResult | null {
  if (!path.startsWith('/api/v1/auth/')) return null
  const state = read()

  if (method === 'get' && path === '/api/v1/auth/me') {
    const user = state.users.find((entry) => entry.id === state.sessionUserId)
    return { status: 200, data: { account: user ? publicAccount(user) : null } }
  }

  if (method === 'get' && path === '/api/v1/auth/providers') {
    return { status: 200, data: { providers: [{ id: 'google', enabled: false }, { id: 'apple', enabled: false }] } }
  }

  if (method === 'post' && path === '/api/v1/auth/login') {
    const { email = '', password = '' } = body(data)
    const user = state.users.find((entry) => entry.email === email.trim().toLowerCase())
    if (!user || user.password !== password) {
      return { status: 401, data: { error: 'email or password is incorrect' } }
    }
    write({ ...state, sessionUserId: user.id })
    return { status: 200, data: { account: publicAccount(user) } }
  }

  if (method === 'post' && path === '/api/v1/auth/signup') {
    const { name = '', email = '', password = '' } = body(data)
    const normalized = email.trim().toLowerCase()
    if (!name.trim()) return { status: 400, data: { error: 'name is required' } }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) return { status: 400, data: { error: 'email is not valid' } }
    if (password.length < 8) return { status: 400, data: { error: 'password must be at least 8 characters' } }
    if (state.users.some((entry) => entry.email === normalized)) {
      return { status: 409, data: { error: 'an account with this email already exists' } }
    }
    const user: MockUser = { id: `acct_mock_${Date.now().toString(16)}`, name: name.trim(), email: normalized, password, role: 'user' }
    write({ sessionUserId: user.id, users: [...state.users, user] })
    return { status: 201, data: { account: publicAccount(user) } }
  }

  if (method === 'post' && path === '/api/v1/auth/logout') {
    write({ ...state, sessionUserId: null })
    return { status: 204, data: null }
  }

  return null
}
