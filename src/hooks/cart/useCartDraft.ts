import { useEffect, useState } from 'react'
import axios from 'axios'
import type { CartLine } from '@/generated/data-model'
import { trackCartEvent } from '@/lib/cartAnalytics'

function storageKey(accountId: string) {
  return `nibble-cart-draft:${accountId || 'guest'}`
}

function readDraft(accountId: string): CartLine[] | null {
  try {
    const raw = sessionStorage.getItem(storageKey(accountId))
    return raw ? JSON.parse(raw) as CartLine[] : null
  } catch {
    return null
  }
}

export function useCartDraft(serverLines: CartLine[], cartId = '', accountId = '') {
  const [lines, setLines] = useState<CartLine[]>(() => readDraft(accountId) ?? serverLines)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (readDraft(accountId) === null) setLines(serverLines)
  }, [accountId, serverLines])

  useEffect(() => {
    try { sessionStorage.setItem(storageKey(accountId), JSON.stringify(lines)) } catch { /* storage is optional */ }
  }, [accountId, lines])

  const persist = (next: CartLine[]) => {
    setSaving(true)
    setSaveError(null)
    void axios.put('/api/v1/cart', { id: cartId, accountId, lines: next })
      .catch(() => setSaveError('Could not save your cart. Your changes are still visible here.'))
      .finally(() => setSaving(false))
  }

  const add = (line: CartLine) => setLines((current) => {
    const existing = current.find((entry) => entry.menuItemId === line.menuItemId)
    const next = existing
      ? current.map((entry) => entry.id === existing.id ? { ...entry, quantity: entry.quantity + line.quantity } : entry)
      : [...current, line]
    persist(next)
    trackCartEvent('suggestion_add', { itemId: line.menuItemId, providerId: line.providerId })
    return next
  })

  const chooseProvider = (lineId: string, providerId: string) => {
    setLines((current) => {
      const next = current.map((line) => line.id === lineId ? { ...line, providerId } : line)
      persist(next)
      trackCartEvent('provider_swap', { providerId })
      return next
    })
  }

  const setQuantity = (lineId: string, quantity: number) => {
    setLines((current) => {
      const next = quantity < 1 ? current.filter((line) => line.id !== lineId) : current.map((line) => line.id === lineId ? { ...line, quantity: Math.min(quantity, 50) } : line)
      persist(next)
      return next
    })
  }

  const remove = (lineId: string) => setQuantity(lineId, 0)

  return { lines, add, chooseProvider, setQuantity, remove, saving, saveError }
}
