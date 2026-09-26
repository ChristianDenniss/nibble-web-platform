/**
 * StatusBadge — an icon + label pill representing an eval run / sync run / classifier-type status (completed, running, failed, pending, cancelled, started, cached, partial, approval states, etc.).
 * Looks the `status` string up in a config map for its semantic color, icon, and display label, falling back to a neutral badge for unknown values. Pass `iconOnly` to drop the label (icon + tooltip / sr-only text) for tight table cells.
 * Lives in `components/badges/`; used wherever a run or approval status needs a colored chip.
 */
import type { ReactNode } from 'react'
import { Check, X, Ban, Clock, Play, Loader2, Zap, AlertTriangle } from 'lucide-react'

interface Config {
  className: string
  icon: ReactNode
  label: string
}

const BADGE_CONFIG: Record<string, Config> = {
  completed: {
    className: 'bg-status-success/15 text-status-success border border-status-success/30',
    icon: <Check size={12} />,
    label: 'Completed',
  },
  pending: {
    className: 'bg-status-pending/15 text-status-pending border border-status-pending/30',
    icon: <Clock size={12} />,
    label: 'Pending',
  },
  running: {
    className: 'bg-status-running/15 text-status-running border border-status-running/30',
    icon: <Loader2 size={12} className="animate-spin" />,
    label: 'Running',
  },
  started: {
    className: 'bg-status-running/15 text-status-running border border-status-running/30',
    icon: <Play size={12} />,
    label: 'Started',
  },
  failed: {
    className: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
    icon: <X size={12} />,
    label: 'Failed',
  },
  cancelled: {
    className: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
    icon: <Ban size={12} />,
    label: 'Cancelled',
  },
  // Session-level only: a mix of terminal outcomes (some succeeded, some failed/cancelled) -
  // deliberately distinct from 'failed'/'completed' so a session doesn't misreport as fully
  // one or the other. See deriveSessionStatus in backend/src/utils/eval-session-status.ts.
  partial: {
    className: 'bg-status-orange/15 text-status-orange border border-status-orange/30',
    icon: <AlertTriangle size={12} />,
    label: 'Partial',
  },
  cached: {
    className: 'bg-status-info/15 text-status-info border border-status-info/30',
    icon: <Zap size={12} />,
    label: 'Cached',
  },
  // Classifier type approval statuses
  approved: {
    className: 'bg-status-success/15 text-status-success border border-status-success/30',
    icon: <Check size={12} />,
    label: 'Approved',
  },
  rejected: {
    className: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
    icon: <X size={12} />,
    label: 'Rejected',
  },
  pending_review: {
    className: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    icon: <Clock size={12} />,
    label: 'Pending Review',
  },
  deleted: {
    className: 'bg-surface-inset text-content-tertiary border border-border',
    icon: <Ban size={12} />,
    label: 'Deleted',
  },
  ok: {
    className: 'bg-status-success/15 text-status-success border border-status-success/30',
    icon: <Check size={12} />,
    label: 'OK',
  },
  healthy: {
    className: 'bg-status-success/15 text-status-success border border-status-success/30',
    icon: <Check size={12} />,
    label: 'Healthy',
  },
  unhealthy: {
    className: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
    icon: <X size={12} />,
    label: 'Unhealthy',
  },
}

interface StatusBadgeProps {
  status: string
  /** Hide the text label; keep the icon and expose the label via title + visually-hidden text. */
  iconOnly?: boolean
}

export default function StatusBadge({ status, iconOnly = false }: StatusBadgeProps) {
  const config: Config = BADGE_CONFIG[status] ?? {
    className: 'bg-surface-inset text-content-muted border border-border',
    icon: null,
    label: status,
  }

  return (
    <span
      title={config.label}
      className={`inline-flex items-center justify-center rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${iconOnly ? 'h-6 w-6 p-0' : 'gap-1 px-2.5 py-1'} ${config.className}`}
    >
      {config.icon ?? (iconOnly ? <span aria-hidden className="text-[10px] font-bold">{config.label.slice(0, 1)}</span> : null)}
      {iconOnly ? <span className="sr-only">{config.label}</span> : config.label}
    </span>
  )
}
