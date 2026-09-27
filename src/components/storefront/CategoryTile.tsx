/**
 * CategoryTile — browse tile for categories and cuisines.
 * `featured` is the large department card; `icon` is the grid chip; `compact` is the small home rail chip.
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
  variant?: 'featured' | 'icon' | 'compact'
  invertColors?: boolean
  className?: string
}

export default function CategoryTile({ item, to, variant = 'icon', invertColors = false, className }: Props) {
  const Icon = browseIcon(item.slug)
  const coverStyle = invertColors ? 'invert' : undefined

  if (variant === 'featured') {
    return (
      <Link to={to} className={cn('group flex flex-col gap-2.5', className)}>
        <CoverBlock
          tone={coverTone(item.id)}
          icon={<Icon size={36} strokeWidth={1.75} />}
          className={cn('h-36 rounded-2xl transition-opacity group-hover:opacity-90', coverStyle)}
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

  if (variant === 'compact') {
    return (
      <Link to={to} className={cn('group flex min-w-[4.25rem] flex-col items-center gap-1', className)}>
        <CoverBlock
          tone={coverTone(item.id)}
          icon={<Icon size={26} strokeWidth={1.75} />}
          className={cn('size-[4.25rem] rounded-full transition-opacity group-hover:opacity-90', coverStyle)}
        />
        <span className="whitespace-nowrap text-center text-xs font-medium leading-tight text-content">{item.name}</span>
      </Link>
    )
  }

  return (
    <Link to={to} className={cn('group flex flex-col items-center gap-2', className)}>
      <CoverBlock
        tone={coverTone(item.id)}
        icon={<Icon size={26} strokeWidth={1.75} />}
        className={cn('aspect-square w-full rounded-2xl transition-opacity group-hover:opacity-90', coverStyle)}
      />
      <span className="text-center text-xs font-semibold leading-tight text-content">{item.name}</span>
    </Link>
  )
}
