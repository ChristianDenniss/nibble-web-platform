import { useEffect } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Shared overlay behavior for anything that renders as a modal/dialog-like
 * surface: locks body scroll while open, closes on Escape, and — when a
 * `containerRef` is supplied — traps Tab/Shift+Tab focus within that
 * container while open and restores focus to whatever element triggered the
 * overlay once it closes. `containerRef` is optional so callers that only
 * need scroll-lock/Escape can omit it (the focus-trap effect is then a no-op).
 *
 * Used by Modal (dialog), Drawer (right-side panel), and MobileNavDrawer
 * (left-side phone nav) — the single source of truth for this behavior so it
 * isn't reimplemented per-overlay.
 */
export function useDismissableOverlay(
  open: boolean,
  onClose: () => void,
  containerRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus trap: move initial focus in, cycle Tab/Shift+Tab within the container,
  // and return focus to whatever triggered the overlay on close.
  useEffect(() => {
    if (!open || !containerRef) return
    const triggerEl = document.activeElement as HTMLElement | null
    const getFocusable = () => {
      const node = containerRef.current
      return node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : []
    }
    ;(getFocusable()[0] ?? containerRef.current)?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) { e.preventDefault(); return }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    window.addEventListener('keydown', handleTab)
    return () => {
      window.removeEventListener('keydown', handleTab)
      triggerEl?.focus()
    }
  }, [open, containerRef])
}
