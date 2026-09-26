/**
 * CategoryTile — large browse tile for the categories / provider-categories grids.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import CoverBlock from './CoverBlock'
import { coverTone } from '@/lib/coverTone'
import type { Category } from '@/generated/data-model'

interface Props {
  category: Category
  to: string
  icon?: ReactNode
}

export default function CategoryTile({ category, to, icon }: Props) {
  return (
    <Link
      to={to}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:bg-surface-brand-hover"
    >
      <CoverBlock tone={coverTone(category.id)} icon={icon} label={category.name.slice(0, 1)} className="h-28 rounded-none" />
      <div className="p-4">
        <h3 className="text-base font-semibold text-content">{category.name}</h3>
        <p className="mt-1 text-sm text-content-muted">{category.description}</p>
      </div>
    </Link>
  )
}
