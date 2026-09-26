/**
 * Pill — the basic rounded tag pill used on cards and detail pages, with an optional leading icon.
 * Color is chosen by a boolean prop (`accent`/`warning`/`success`/`info`/`purple`/`danger`, else default); `bare` gives a borderless tighter style, and passing `onClick` renders it as an interactive `<button>` (with `disabled` support).
 * Lives in `components/pills/`; the go-to chip for plain tag lists in bubbles and cards.
 */
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  accent?: boolean
  warning?: boolean
  success?: boolean
  info?: boolean
  purple?: boolean
  danger?: boolean
  /** Borderless, tighter-padded style for plain tag lists (cards/bubbles) instead of the default bordered pill. */
  bare?: boolean
  icon?: ReactNode
  onClick?: () => void
  title?: string
  disabled?: boolean
  className?: string
}

const COLORS = {
  accent:  { bg: 'bg-brand/10',          text: 'text-accent',           border: 'border-brand/30' },
  warning: { bg: 'bg-status-warning/15', text: 'text-status-warning',   border: 'border-status-warning/30' },
  success: { bg: 'bg-status-success/15', text: 'text-status-success',   border: 'border-status-success/30' },
  info:    { bg: 'bg-status-info/15',    text: 'text-status-info',      border: 'border-status-info/30' },
  purple:  { bg: 'bg-status-purple/15',  text: 'text-status-purple',    border: 'border-status-purple/30' },
  danger:  { bg: 'bg-status-danger/15',  text: 'text-status-danger',    border: 'border-status-danger/30' },
  default: { bg: 'bg-surface-inset',     text: 'text-content-tertiary', border: 'border-border' },
}

export default function Pill({
  children, accent, warning, success, info, purple, danger, bare, icon, onClick, title, disabled, className,
}: Props) {
  const interactive = onClick
    ? disabled
      ? 'cursor-not-allowed opacity-40'
      : 'cursor-pointer hover:opacity-75 transition-opacity'
    : ''
  const Tag = onClick ? 'button' : 'span'
  const handleClick = disabled ? undefined : onClick
  const colorKey = accent ? 'accent' : warning ? 'warning' : success ? 'success' : info ? 'info' : purple ? 'purple' : danger ? 'danger' : 'default'
  const { bg, text, border } = COLORS[colorKey]
  const shape = bare
    ? `text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${bg} ${text}`
    : `text-xs px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${bg} ${text} ${border}`
  return (
    <Tag className={`${shape} ${interactive} ${className ?? ''}`} onClick={handleClick} title={title}>
      {icon}{children}
    </Tag>
  )
}
