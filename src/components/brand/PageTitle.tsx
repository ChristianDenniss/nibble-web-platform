/**
 * PageTitle — the full page-header title block: a `PageIcon`, an `h1` heading, and an optional rounded count badge.
 * Renders the count badge only when `count` is non-null; `className` overrides the wrapper flex gap and `children` appends extra inline content after the badge (e.g. an `InfoTip`).
 * Lives in `components/brand/`; use for every page title instead of hand-rolling icon/heading/badge markup.
 */
import type { ReactNode } from 'react'
import PageIcon from './PageIcon'

interface Props {
  icon: ReactNode
  title: string
  count?: number | null
  className?: string
  children?: ReactNode
}

export default function PageTitle({ icon, title, count, className = 'gap-4', children }: Props) {
  return (
    <div className={`flex items-center ${className}`}>
      <PageIcon icon={icon} />
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold lg:text-2xl text-content">{title}</h1>
        {count != null && (
          <span className="inline-flex items-center px-1.5 h-6 rounded-full border border-border bg-surface-inset text-xs font-semibold tabular-nums text-content-secondary">
            {count.toLocaleString()}
          </span>
        )}
        {children}
      </div>
    </div>
  )
}
