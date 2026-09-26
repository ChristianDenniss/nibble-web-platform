/**
 * EmptyState — the standard empty-data placeholder (use instead of an inline "No results" line): a centered dashed-border surface panel with optional icon, title, description, and action.
 * Props: `label?` for a one-liner, or `title?`/`description?`/`icon?`/`action?`/`children?` for a richer state; `compact?` drops the border/padding for use inside an already-bordered panel.
 * Lives in `components/misc/`; used across list and table views for empty results.
 */
import type { ReactNode } from 'react'

interface EmptyStateProps {
  label?: string
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  children?: ReactNode
  /** Drops the dashed border/box padding - use inside an already-bordered panel. */
  compact?: boolean
}

export default function EmptyState({ label, title, description, icon, action, children, compact }: EmptyStateProps) {
  if (compact) {
    return <div className="text-center text-sm text-content-muted">{label ?? title}</div>
  }

  if (!title && !icon && !action && !children) {
    return (
      <div className="p-8 bg-surface border border-dashed border-border rounded-xl text-center text-content-muted">
        {label}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 p-8 bg-surface border border-dashed border-border rounded-xl text-center">
      {icon}
      {(title || label) && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-content">{title ?? label}</p>
          {description && <p className="text-xs text-content-muted">{description}</p>}
        </div>
      )}
      {children}
      {action}
    </div>
  )
}
