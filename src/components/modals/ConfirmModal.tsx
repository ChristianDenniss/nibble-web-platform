/**
 * ConfirmModal — generic confirm/cancel dialog rendered in a portal with a scrim (blurred by default), status icon, title, and description; use instead of `window.confirm`.
 * Props: `open`, `onClose`, `onConfirm`, `title`, `description`, `confirmLabel?`, `cancelLabel?`, `loading?`, `busyLabel?` (confirm button label while `loading`, defaults to 'Deleting…'), `danger?` (red confirm button + trash icon), `blurBackdrop?` (default `true` - set `false` for a plain dimmed scrim with no blur). Traps focus and closes on Escape / backdrop click.
 * Lives in `components/modals/`; used anywhere a destructive or confirmatory action needs acknowledgement.
 */
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, AlertTriangle } from 'lucide-react'
import Button from '@/components/buttons/Button'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  /** Confirm button label shown while `loading` is true. Defaults to 'Deleting…' for
   * backward compatibility with existing (mostly destructive) callers - pass an accurate
   * label (e.g. 'Pausing…', 'Saving…') when the confirmed action isn't a delete. */
  busyLabel?: string
  danger?: boolean
  /** Set false for a plain dimmed scrim with no blur. Defaults to true (existing behavior). */
  blurBackdrop?: boolean
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading,
  busyLabel,
  danger = false,
  blurBackdrop = true,
}: Props) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, loading])

  // Focus trap: move initial focus in, cycle Tab/Shift+Tab within the dialog,
  // and return focus to whatever triggered the modal on close.
  useEffect(() => {
    if (!open) return
    const triggerEl = document.activeElement as HTMLElement | null
    const node = dialogRef.current
    const getFocusable = () => node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : []
    ;(getFocusable()[0] ?? node)?.focus()

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
  }, [open])

  if (!open) return null

  const Icon = danger ? Trash2 : AlertTriangle

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className={`absolute inset-0 ${blurBackdrop ? 'backdrop-blur-sm' : ''} ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        style={{ background: 'var(--color-overlay)' }}
        onClick={() => !loading && onClose()}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-sm bg-surface rounded-2xl border border-border shadow-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center ${danger ? 'bg-status-danger/10' : 'bg-status-warning/10'}`}>
            <Icon size={20} className={danger ? 'text-status-danger' : 'text-status-warning'} />
          </div>
          <div className="space-y-1.5 pt-0.5">
            <h2 id={titleId} className="text-base font-semibold text-content">{title}</h2>
            <p className="text-sm text-content-secondary">{description}</p>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? (busyLabel ?? 'Deleting…') : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
