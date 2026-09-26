/**
 * TabButton — an underline-style tab trigger, horizontal by default or vertical for a rail-style nav; shows an optional trailing count badge.
 * Props: `active`, `onClick`, `children`, `orientation?: 'horizontal' | 'vertical'` (default horizontal), `count?`, `className?` (appended, e.g. for responsive width tweaks). Horizontal tabs use tighter padding and type on the `small` viewport; they stay content-sized (`shrink-0`) so labels cannot overlap.
 * Lives in `components/buttons/` alongside `Toggle` (a stateful control button, same shape as this one) rather than `components/navigation/` - it renders a `<button>` and is a clickable action with an active/inactive state, not app navigation chrome (Sidebar/Header/Breadcrumb).
 */
import type { ReactNode } from 'react'

interface Props {
  active: boolean
  onClick: () => void
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  count?: number
  className?: string
}

export default function TabButton({ active, onClick, children, orientation = 'horizontal', count, className = '' }: Props) {
  const isVertical = orientation === 'vertical'
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap',
        isVertical
          ? `w-full px-3 py-2 rounded-lg text-left border-l-2 ${active ? 'border-accent text-accent bg-accent/10' : 'border-transparent text-content-secondary hover:text-content hover:bg-surface-inset'}`
          : `shrink-0 px-4 py-2.5 max-small:px-2 max-small:py-2 max-small:text-xs max-small:gap-1 border-b-2 -mb-px box-border ${active ? 'border-accent text-accent' : 'border-transparent text-content-secondary hover:text-content hover:border-border-strong'}`,
        className,
      ].join(' ')}
    >
      <span className="min-w-0 flex items-center justify-center gap-1.5">{children}</span>
      {count != null && (
        <span data-count className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 max-small:min-w-4 max-small:h-4 max-small:px-0.5 max-small:text-[10px] rounded-full text-xs tabular-nums ${active ? 'bg-accent/20 text-accent' : 'bg-surface-inset text-content-muted'}`}>
          {count}
        </span>
      )}
    </button>
  )
}
