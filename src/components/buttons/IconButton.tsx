/**
 * IconButton — an icon-only button wrapper rendering a single Lucide icon with an accessible `title`/`aria-label`.
 * Props: `icon`, `onClick`, `title`, optional `disabled`, `variant` ('default' | 'danger' | 'info'), `active`
 * (persistent filled/tinted background instead of only the hover-triggered one, for toggled-on states), `size`
 * ('sm' | 'md'), and `className`.
 * Lives in `components/buttons/`; the shared base for icon buttons like CancelButton, DeleteButton, and EditButton.
 */
import type { LucideIcon } from 'lucide-react'

type IconButtonVariant = 'default' | 'danger' | 'info'

interface Props {
  icon: LucideIcon
  onClick: () => void
  title: string
  disabled?: boolean
  variant?: IconButtonVariant
  active?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  default: 'text-content-muted hover:text-content',
  danger:  'text-status-danger hover:bg-status-danger/10',
  info:    'text-status-info hover:bg-status-info/10',
}

// Applied instead of VARIANT_CLASS when `active` is true — a persistent filled/tinted
// background for "toggled on" states, rather than one that only appears on hover.
const ACTIVE_VARIANT_CLASS: Record<IconButtonVariant, string> = {
  default: 'text-content bg-surface-inset hover:bg-surface-elevated',
  danger:  'text-status-danger bg-status-danger/15 hover:bg-status-danger/25',
  info:    'text-status-info bg-status-info/15 hover:bg-status-info/25',
}

const SIZE_CLASS = {
  md: { button: 'px-2 py-1', icon: 'w-5 h-5' },
  sm: { button: 'px-1 py-0.5', icon: 'w-4 h-4' },
}

export default function IconButton({
  icon: Icon,
  onClick,
  title,
  disabled,
  variant = 'default',
  active = false,
  size = 'md',
  className = '',
}: Props) {
  const { button, icon } = SIZE_CLASS[size]
  const colorClass = active ? ACTIVE_VARIANT_CLASS[variant] : VARIANT_CLASS[variant]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`${button} rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${colorClass} ${className}`}
    >
      <Icon className={icon} />
    </button>
  )
}
