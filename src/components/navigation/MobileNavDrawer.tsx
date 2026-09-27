/**
 * MobileNavDrawer — phone-only (`small` tier) off-canvas navigation that slides in from the left over a dimming scrim and hosts `<Sidebar variant="panel">` 1:1.
 * Supports tap-scrim / Escape / route-change dismissal, drag-to-close, and a left-edge swipe-to-open gesture (Safari's back-swipe owns the first ~20px, so the zone is 56px). The gesture is detected via document-level touch listeners filtered by starting X - not a physical overlay div - so it never steals clicks/taps from real content sitting near the left edge. Scroll-lock, Escape, focus-trap and focus-restoration all come from `useDismissableOverlay`.
 * Lives in `components/navigation/`; only rendered by AppLayout when the viewport is `small`, opened via the Header hamburger or the edge swipe.
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { useDismissableOverlay } from '@/hooks/utils/useDismissableOverlay'

// Drag-to-dismiss thresholds: a decisive flick (fast velocity) closes even with a
// small offset; a slow deliberate drag needs to cross most of the panel width.
const SWIPE_VELOCITY_THRESHOLD = 500
const SWIPE_OFFSET_THRESHOLD   = 80
// Swipe-to-open only needs a plain touch delta (the drawer isn't mounted/visible yet
// to drag). Horizontal intent must beat vertical so a scroll that starts on the strip
// does not open the drawer.
const EDGE_SWIPE_OPEN_THRESHOLD = 36
const EDGE_SWIPE_ZONE_PX = 56

// A right-swipe starting on a horizontal rail (promo carousel, chip row, tab bar) that is
// scrolled away from its start belongs to the rail, not the drawer.
function insideRailThatCanScrollBack(target: EventTarget | null): boolean {
  for (let el = target instanceof Element ? target : null; el && el !== document.body; el = el.parentElement) {
    if (el.scrollLeft > 0 && el.scrollWidth > el.clientWidth) {
      const { overflowX } = getComputedStyle(el)
      if (overflowX === 'auto' || overflowX === 'scroll') return true
    }
  }
  return false
}

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
  onOpen: () => void
}

// Mirrors Drawer.tsx's overlay pattern: scroll-lock + Escape via useDismissableOverlay, slide via animated transform.
export default function MobileNavDrawer({ open, onClose, onOpen }: MobileNavDrawerProps) {
  const { pathname } = useLocation()
  const panelRef = useRef<HTMLElement>(null)
  const edgeStart = useRef<{ x: number; y: number } | null>(null)
  useDismissableOverlay(open, onClose, panelRef)

  // Close the drawer whenever the route changes (user tapped a nav link).
  useEffect(() => {
    if (open) onClose()
  }, [pathname])

  // Listened on `document` rather than a dedicated overlay div - a physical left-edge strip
  // would sit in front of (and swallow clicks on) any real content living in that same margin,
  // e.g. a "← Back" button flush against the left edge. Filtering by starting X gets the same
  // "swipe belongs to the drawer" zone without stealing hit-testing from the page underneath.
  // React's onTouchMove is passive, so preventDefault there cannot cancel Safari's edge-back
  // navigation - bind a non-passive listener directly instead.
  useEffect(() => {
    if (open) return

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t.clientX > EDGE_SWIPE_ZONE_PX) return
      if (insideRailThatCanScrollBack(e.target)) return
      edgeStart.current = { x: t.clientX, y: t.clientY }
    }
    const onMove = (e: TouchEvent) => {
      if (!edgeStart.current) return
      const t = e.touches[0]
      const dx = t.clientX - edgeStart.current.x
      const dy = t.clientY - edgeStart.current.y
      const horizontal = dx > 8 && dx > Math.abs(dy)
      if (horizontal) e.preventDefault()
      if (horizontal && dx > EDGE_SWIPE_OPEN_THRESHOLD) {
        edgeStart.current = null
        onOpen()
      }
    }
    const onEnd = () => { edgeStart.current = null }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
    document.addEventListener('touchcancel', onEnd)
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', onEnd)
    }
  }, [open, onOpen])

  return (
    <>
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-300 cursor-pointer ${open ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'var(--color-overlay-sm)' }}
          onClick={onClose}
        />

        {/* Panel - flush left/top/bottom, slides from the left. Draggable so the user
            can swipe it away instead of only tapping the scrim/close button. */}
        <motion.section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          tabIndex={-1}
          className={[
            'absolute inset-y-0 left-0 w-[85vw] max-w-[320px]',
            'flex flex-col overflow-hidden rounded-r-[14px]',
            'shadow-[var(--shadow-lg)]',
          ].join(' ')}
          drag="x"
          dragConstraints={{ left: -400, right: 0 }}
          dragElastic={{ left: 0.1, right: 0 }}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -SWIPE_OFFSET_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) onClose()
          }}
          initial={false}
          animate={{ x: open ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
        >
          <Sidebar variant="panel" collapsed={false} onToggleCollapse={() => {}} onClose={onClose} />
        </motion.section>
      </div>
    </>
  )
}
