import { useSyncExternalStore } from 'react'
import type { CartLine } from '@/generated/data-model'

const key = 'nibble-restaurant-cart-v3'
const empty: CartLine[] = []
function read(): CartLine[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!Array.isArray(value) || value.length > 150) return empty
    const seen = new Set<string>()
    const lines: CartLine[] = []
    for (const entry of value as unknown[]) {
      if (typeof entry !== 'object' || entry === null) return empty
      const line = entry as Record<string, unknown>
      if (!line || typeof line.id !== 'string' || typeof line.menuItemId !== 'string' || typeof line.restaurantId !== 'string' || !line.restaurantId.startsWith('catalog-') || typeof line.providerId !== 'string' || typeof line.quantity !== 'number' || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 50 || seen.has(line.menuItemId)) return empty
      seen.add(line.menuItemId)
      lines.push({ id: line.id, menuItemId: line.menuItemId, restaurantId: line.restaurantId, providerId: line.providerId, quantity: line.quantity })
    }
    return new Set(lines.map(line => line.restaurantId)).size <= 1 ? lines : empty
  } catch { return empty }
}
let lines = read()
const listeners = new Set<() => void>()
function save(next: CartLine[]) {
  lines = next
  try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* usable in memory */ }
  listeners.forEach(listener => listener())
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) { lines = read(); listeners.forEach(fn => fn()) } }
  window.addEventListener('storage', sync)
  return () => { listeners.delete(listener); window.removeEventListener('storage', sync) }
}
// Keep the upstream hook signature while the local cart is persisted across reloads.
export function useCartDraft(_serverLines?: CartLine[], _cartId?: string, _accountId?: string) {
  void _serverLines; void _cartId; void _accountId
  const current = useSyncExternalStore(subscribe, () => lines, () => empty)
  return {
    lines: current, saving: false, saveError: null,
    add(line: CartLine, replace = false) {
      if (!Number.isInteger(line.quantity) || line.quantity < 1) return false
      if (lines.length && lines[0].restaurantId !== line.restaurantId && !replace) return false
      const base = replace ? [] : lines
      const existing = base.find(entry => entry.menuItemId === line.menuItemId)
      save(existing ? base.map(entry => entry.id === existing.id ? { ...entry, quantity: Math.min(50, entry.quantity + line.quantity) } : entry) : [...base, { ...line, quantity: Math.min(50, line.quantity) }])
      return true
    },
    setQuantity(id: string, quantity: number) {
      if (!Number.isInteger(quantity)) return
      save(quantity < 1 ? lines.filter(line => line.id !== id) : lines.map(line => line.id === id ? { ...line, quantity: Math.min(50, quantity) } : line))
    },
    remove(id: string) { save(lines.filter(line => line.id !== id)) },
    chooseProvider(id: string, providerId: string) { save(lines.map(line => line.id === id ? { ...line, providerId } : line)) },
    clear() { save([]) },
  }
}
