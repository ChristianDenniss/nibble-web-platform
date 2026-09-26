/**
 * notify — the app-wide toast helper (`notify.success/error/info/warn/cancelled`). Renders every
 * toast via `toast.custom()` for full control of the card, with swipe-to-dismiss (drag on the
 * outer card) and click-to-navigate (`onTap` on the inner button, coordinated with the drag
 * gesture) built in - not a separate opt-in.
 * Lives in `utils/`; rendered through `AppToaster` (`components/overlays/`).
 */
import type { CSSProperties } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import toast, { type Toast } from 'react-hot-toast'
import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from 'lucide-react'

const SWIPE_VELOCITY_THRESHOLD = 500
const SWIPE_OFFSET_THRESHOLD = 60

// toast.custom() renders exactly what we return with no react-hot-toast chrome around it, so the
// pill background/padding/icon/text all have to live in here - that's what lets motion.div
// drag the entire card as one unit instead of just the message text.
const BASE_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: 'var(--color-content)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
  boxShadow: 'var(--shadow-sm)',
  padding: '8px 10px',
  maxWidth: 350,
  pointerEvents: 'auto',
}

interface NotifyOptions {
  // Optional extra action (e.g. jump to the matching audit log entry) that runs when the
  // toast is clicked, in addition to dismissing it. Every toast is click-to-dismiss
  // regardless of whether this is set - it still also auto-dismisses on its own.
  onClick?: () => void
}

function StatusIcon({ color, Icon }: { color: string; Icon: LucideIcon }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      background: `color-mix(in srgb, ${color} 20%, var(--color-surface))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={12} color={color} />
    </div>
  )
}

// Scale transform on hover lives on the outer draggable card so the whole toast grows, not just
// the inner button.
const CLICKABLE_CLASS = 'cursor-pointer transition-transform hover:scale-[1.03]'

function toastCard(
  t: Toast,
  msg: string,
  color: string,
  Icon: LucideIcon,
  ariaLive: 'polite' | 'assertive',
  opts?: NotifyOptions,
) {
  function handleDragEnd(_e: unknown, info: PanInfo) {
    const { offset, velocity } = info
    const decisive =
      Math.abs(offset.x) > SWIPE_OFFSET_THRESHOLD || Math.abs(offset.y) > SWIPE_OFFSET_THRESHOLD ||
      Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD || Math.abs(velocity.y) > SWIPE_VELOCITY_THRESHOLD
    if (decisive) toast.dismiss(t.id)
  }

  return (
    <motion.div
      className={CLICKABLE_CLASS}
      style={{
        ...BASE_STYLE,
        background: `color-mix(in srgb, ${color} 12%, var(--color-surface))`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
      drag
      dragElastic={0.6}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: t.visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      // toast.custom() opts out of react-hot-toast's own aria-live wrapper, so without this the
      // toast (including error messages) is invisible to screen readers. role="status" plus
      // aria-live re-adds that announcement; error/cancelled toasts use "assertive" so they
      // interrupt rather than wait for the reader to be idle.
      role="status"
      aria-live={ariaLive}
    >
      <StatusIcon color={color} Icon={Icon} />
      {/* motion.button's onTap (not a plain onClick) - framer's own tap gesture is what correctly
       *  coordinates with the parent's `drag` gesture. A native onClick nested inside a
       *  drag-enabled motion.div isn't part of that gesture system, so it can fire late or not
       *  at all once framer's pointer capture is in the mix. */}
      <motion.button
        type="button"
        onTap={() => {
          toast.dismiss(t.id)
          opts?.onClick?.()
        }}
        className="flex-1 text-left cursor-pointer"
        style={{ whiteSpace: 'pre-line' }}
      >
        {msg}
      </motion.button>
    </motion.div>
  )
}

function customToast(
  msg: string,
  color: string,
  Icon: LucideIcon,
  ariaLive: 'polite' | 'assertive',
  opts?: NotifyOptions,
) {
  return toast.custom(t => toastCard(t, msg, color, Icon, ariaLive, opts), { id: msg })
}

export const notify = {
  success:   (msg: string, opts?: NotifyOptions) => customToast(msg, 'var(--color-status-success)', CheckCircle2, 'polite', opts),
  error:     (msg: string, opts?: NotifyOptions) => customToast(msg, 'var(--color-status-danger)', XCircle, 'assertive', opts),
  info:      (msg: string, opts?: NotifyOptions) => customToast(msg, 'var(--color-status-info)', Info, 'polite', opts),
  warn:      (msg: string, opts?: NotifyOptions) => customToast(msg, 'var(--color-status-warning)', AlertTriangle, 'polite', opts),
  cancelled: (msg: string, opts?: NotifyOptions) => customToast(msg, 'var(--color-status-danger)', XCircle, 'assertive', opts),
}
