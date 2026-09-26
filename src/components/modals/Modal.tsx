/**
 * Modal — base modal dialog shell every concrete modal is built on: portal-rendered scrim (blurred by default), a header with title / optional `headerActions` / close button, and a scrollable body.
 * Props: `open`, `onClose`, `title`, `children`, `align?` (`center` vertically centered; `top` pins near the viewport top), `size?` (md/lg/xl/2xl), `maxWidthClassName?`, `headerActions?`, `bodyClassName?`, `scrollBody?`, `blurBackdrop?` (default `true` - set `false` for a plain dimmed scrim with no blur). Traps focus, restores it on close, and closes on Escape / backdrop click — all via the shared `useDismissableOverlay` hook.
 * Lives in `components/modals/`; the shared foundation for ConfirmModal, HfMissingModal, RegisterAssetModal, DatasetMappingModal, etc.
 */
import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDismissableOverlay } from '@/hooks/utils/useDismissableOverlay'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  align?: 'center' | 'top'
  size?: 'md' | 'lg' | 'xl' | '2xl'
  /** Overrides the size-tier width with an exact Tailwind max-w class, for one-off in-between
   * widths that don't fit the fixed size tiers. Takes precedence over `size`. */
  maxWidthClassName?: string
  headerActions?: React.ReactNode
  /** Overrides the content area's default `px-6 py-5` padding, for one-off callers that want
   * more/less breathing room than the standard modal body. */
  bodyClassName?: string
  /** Set false when children manage their own internal scroll region, to avoid a redundant nested scrollbar. */
  scrollBody?: boolean
  /** Set false for a plain dimmed scrim with no blur. Defaults to true (existing behavior). */
  blurBackdrop?: boolean
}

export default function Modal({ open, onClose, title, children, align = 'center', size = 'md', maxWidthClassName, headerActions, bodyClassName, scrollBody = true, blurBackdrop = true }: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  useDismissableOverlay(open, onClose, dialogRef)

  if (!open) return null

  return createPortal(
    <div className={`fixed inset-0 z-50 flex justify-center px-4 ${align === 'top' ? 'items-start pt-6 max-small:pt-4' : 'items-center'}`}>
      <div className={`absolute inset-0 cursor-pointer ${blurBackdrop ? 'backdrop-blur-sm' : ''}`} style={{ background: 'var(--color-overlay)' }} onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative z-10 w-full ${maxWidthClassName ?? (size === '2xl' ? 'max-w-6xl' : size === 'xl' ? 'max-w-4xl' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg')} bg-surface rounded-xl border border-border shadow-2xl max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
          <h2 id={titleId} className="text-2xl font-bold text-content flex-1">{title}</h2>
          {headerActions}
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-content-muted hover:text-content transition-colors rounded-md p-0.5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className={`${bodyClassName ?? 'px-6 py-5'} ${scrollBody ? 'overflow-y-auto' : 'flex-1 min-h-0 flex flex-col overflow-hidden'}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
