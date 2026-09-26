/**
 * CategoryTile — browse tile for categories and cuisines.
 * `featured` is the large department card; `icon` is the compact carousel/grid chip.
 */
import { Link } from 'react-router-dom'
import CoverBlock from './CoverBlock'
import { browseIcon } from '@/lib/browseIcons'
import { coverTone } from '@/lib/coverTone'
import { cn } from '@/lib/utils'

export interface BrowseTileItem {
  id: string
  slug: string
  name: string
  description?: string
}

interface Props {
  item: BrowseTileItem
  to: string
  variant?: 'featured' | 'icon'
  className?: string
}

export default function CategoryTile({ item, to, variant = 'icon', className }: Props) {
  const Icon = browseIcon(item.slug)

  if (variant === 'featured') {
    return (
      <Link to={to} className={cn('group flex flex-col gap-2.5', className)}>
        <CoverBlock
          tone={coverTone(item.id)}
          icon={<Icon size={36} strokeWidth={1.75} />}
          className="h-36 rounded-2xl transition-opacity group-hover:opacity-90"
        />
        <div>
          <h3 className="text-base font-semibold text-content">{item.name}</h3>
          {item.description && (
            <p className="mt-0.5 text-sm text-content-muted">{item.description}</p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link to={to} className={cn('group flex flex-col items-center gap-2', className)}>
      <CoverBlock
        tone={coverTone(item.id)}
        icon={<Icon size={26} strokeWidth={1.75} />}
        className="aspect-square w-full rounded-2xl transition-opacity group-hover:opacity-90"
      />
      <span className="text-center text-xs font-semibold leading-tight text-content">{item.name}</span>
    </Link>
  )
}
