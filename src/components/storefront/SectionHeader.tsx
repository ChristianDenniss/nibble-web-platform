/**
 * SectionHeader — row title used on home and browse pages, optional "See all" link.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  title: string
  to?: string
  actionLabel?: string
  children?: ReactNode
}

export default function SectionHeader({ title, to, actionLabel = 'See all', children }: Props) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-content">{title}</h2>
        {children}
      </div>
      {to && (
        <Link to={to} className="text-sm font-medium text-accent hover:opacity-80">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
