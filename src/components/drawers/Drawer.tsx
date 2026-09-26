/**
 * Drawer — portal-rendered (like Modal/ConfirmModal) base side drawer panel that slides in from the right over a light dimming scrim, with a rounded-left panel, header (title + optional `headerExtra` + `headerActions` + close button), an optional full-width `subHeader` row below it, and a scrollable body.
 * Props: `open`, `onClose`, `title`, `headerExtra?`, `headerActions?`, `subHeader?`, `children`, `className?`; dismisses via `useDismissableOverlay` (Escape / backdrop click), which also traps Tab focus within the panel and restores it to the trigger element on close.
 * `subHeader` sits in its own row, outside the scrollable body (like the title row) - use it for controls (e.g. a search bar) that need real width and must stay fixed while the body scrolls, rather than competing with the title for space in `headerExtra`.
 * Lives in `components/drawers/`; the shared shell for drawer bodies like ModelSummaryPane.
 */
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDismissableOverlay } from '@/hooks/utils/useDismissableOverlay'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  headerExtra?: React.ReactNode
  /** Icon/text actions that sit on the title row next to the close button (not with wrapping chips). */
  headerActions?: React.ReactNode
  subHeader?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export default function Drawer({ open, onClose, title, headerExtra, headerActions, subHeader, children, className }: DrawerProps) {
  const panelRef = useRef<HTMLElement>(null)
  useDismissableOverlay(open, onClose, panelRef)

  return createPortal(
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'visible' : 'invisible'}`}>
      {/* Backdrop - light dimming, no blur */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 cursor-pointer ${open ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'var(--color-overlay-sm)' }}
        onClick={onClose}
      />

      {/* Panel - flush right/top/bottom, rounded left corners only (matches troj-web-platform HeroUI drawer) */}
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 w-full max-w-[42rem] flex flex-col rounded-l-[14px] overflow-hidden transition-transform duration-300 ease-in-out shadow-[var(--shadow-lg)] ${open ? 'translate-x-0' : 'translate-x-full'} ${className ?? 'bg-surface-elevated'}`}
      >
        {/* Header. Phone: title + actions/close on the first row, chips wrap onto a
            full-width second row so the larger close target doesn't force a chip scrollbar. */}
        <header className="flex-shrink-0 flex items-center gap-3 border-b border-border px-4 py-3 max-small:flex-wrap">
          <h2 className="whitespace-nowrap text-lg font-semibold text-content max-small:min-w-0 max-small:flex-1 max-small:truncate">{title}</h2>
          {headerExtra && (
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto max-small:order-last max-small:basis-full max-small:overflow-x-hidden max-small:flex-wrap">
              {headerExtra}
            </div>
          )}
          <div className="ml-auto flex shrink-0 items-center">
            {headerActions}
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex items-center justify-center p-1.5 max-small:size-11 rounded-full text-content-muted hover:text-content hover:bg-surface-inset active:bg-hover transition-colors cursor-pointer"
            >
              <X className="size-4 max-small:size-5" />
            </button>
          </div>
        </header>

        {subHeader && (
          <div className="flex-shrink-0 border-b border-border px-4 py-2.5">
            {subHeader}
          </div>
        )}

        {/* Body - min-h-0 lets flex children shrink so overflow-y-auto scrolls */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden py-2 px-4 pb-6">
          {children}
        </div>
      </section>
    </div>,
    document.body
  )
}
