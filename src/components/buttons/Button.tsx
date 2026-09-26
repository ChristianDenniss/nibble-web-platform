/**
 * Button — the base clickable-action button for all interactive controls, rendering a styled `<button>` with icon+label slot.
 * Supports `variant` (primary, secondary, ghost, outline, danger/danger-filled, accent, success/success-outline, warning/warning-outline, info, pink) and `size` (xs, sm, md, icon), and forwards all native button attributes.
 * Lives in `components/buttons/`; the foundation for every clickable action across the app and wrapped by higher-level buttons like RegisterAssetButton and SyncAssetButton.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'danger-filled' | 'accent' | 'success' | 'success-outline' | 'warning' | 'warning-outline' | 'info' | 'pink'
  size?: 'xs' | 'sm' | 'md' | 'icon'
  children: ReactNode
}

const VARIANT_CLASSES = {
  primary:   'bg-brand text-on-brand font-semibold hover:opacity-90 disabled:opacity-40',
  secondary: 'bg-surface-inset border border-border text-content-secondary font-medium hover:bg-surface-raised disabled:opacity-40',
  ghost:     'text-content-secondary font-medium hover:text-content hover:bg-surface-inset disabled:opacity-40',
  /** A bordered ghost - outline instead of no border, and fainter (`content-muted`) text than
   *  `ghost`/`secondary` both use. For a dismissive action (Cancel) that should read as quieter
   *  than its paired primary/success action, not just borderless. */
  outline:   'bg-transparent border border-border text-content-muted font-medium hover:bg-surface-inset hover:text-content-secondary disabled:opacity-40',
  danger:        'border border-status-danger/50 text-status-danger font-medium hover:bg-status-danger/10 disabled:opacity-40',
  'danger-filled': 'bg-status-danger/10 text-status-danger border border-status-danger/30 font-medium hover:bg-status-danger/20 disabled:opacity-40',
  accent:    'bg-accent/10 text-accent border border-accent/30 font-medium hover:bg-accent/20 disabled:opacity-40',
  success:          'bg-status-success/10 text-status-success border border-status-success/30 font-medium hover:bg-status-success/20 disabled:opacity-40',
  'success-outline': 'bg-surface-inset text-content-secondary border border-border-strong font-medium hover:bg-surface-raised disabled:opacity-40',
  warning:          'bg-status-warning/10 text-status-warning border border-status-warning/30 font-medium hover:bg-status-warning/20 disabled:opacity-40',
  'warning-outline': 'bg-surface-inset text-content-secondary border border-border-strong font-medium hover:bg-surface-raised disabled:opacity-40',
  info:      'bg-status-info/10 text-status-info border border-status-info/30 font-medium hover:bg-status-info/20 disabled:opacity-40',
  pink:      'bg-status-pink/20 text-status-pink border border-status-pink/50 font-medium hover:bg-status-pink/30 disabled:opacity-40',
}

const SIZE_CLASSES = {
  xs:   'h-6 px-3 rounded-md',
  sm:   'h-8 px-4 rounded-md',
  md:   'h-8 px-4 rounded-lg',
  icon: 'h-7 w-7 p-0 rounded-full',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
