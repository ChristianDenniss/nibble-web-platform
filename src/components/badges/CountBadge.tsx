/**
 * CountBadge — a rounded, bordered count pill (e.g. "42") shown next to a page or section heading.
 * Renders a locale-formatted, tabular-nums number; `size` (`'sm' | 'md'`, default `md`) controls height and text size.
 * `color` (`'success' | 'info' | 'warning' | 'danger' | 'purple'`, default neutral) swaps the border/background/text to the matching status tokens.
 * Lives in `components/badges/`; used beside page/section titles such as "Models 42".
 */
interface Props {
  count: number
  size?: 'sm' | 'md'
  color?: 'success' | 'info' | 'warning' | 'danger' | 'purple'
}

const COLOR_CLASSES = {
  success: 'border-status-success/30 bg-status-success/15 text-status-success',
  info:    'border-status-info/30    bg-status-info/15    text-status-info',
  warning: 'border-status-warning/30 bg-status-warning/15 text-status-warning',
  danger:  'border-status-danger/30  bg-status-danger/15  text-status-danger',
  purple:  'border-status-purple/30  bg-status-purple/15  text-status-purple',
}

export default function CountBadge({ count, size = 'md', color }: Props) {
  const sizeClasses = size === 'sm' ? 'h-5 text-[11px]' : 'h-6 text-xs'
  const colorClasses = color ? COLOR_CLASSES[color] : 'border-border bg-surface-inset text-content-secondary'
  return (
    <span className={`inline-flex items-center px-1.5 ${sizeClasses} rounded-full border ${colorClasses} font-semibold tabular-nums`}>
      {count.toLocaleString()}
    </span>
  )
}
