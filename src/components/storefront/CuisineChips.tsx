/**
 * CuisineChips — horizontal pill row for refining a category or jumping between cuisines.
 */
import { Link } from 'react-router-dom'
import Pill from '@/components/pills/Pill'
import { useDragScroll } from '@/hooks/utils/useDragScroll'
import type { Cuisine } from '@/generated/data-model'

interface Props {
  cuisines: Cuisine[]
  activeSlug?: string | null
  hrefFor: (slug: string) => string
  allHref?: string
  className?: string
}

export default function CuisineChips({ cuisines, activeSlug, hrefFor, allHref, className = '' }: Props) {
  const dragScroll = useDragScroll<HTMLDivElement>()
  return (
    <div ref={dragScroll} className={`flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-none ${className}`}>
      {allHref && (
        <Link to={allHref} className="shrink-0">
          <Pill accent={!activeSlug}>All</Pill>
        </Link>
      )}
      {cuisines.map((cuisine) => (
        <Link key={cuisine.id} to={hrefFor(cuisine.slug)} className="shrink-0">
          <Pill accent={cuisine.slug === activeSlug}>{cuisine.name}</Pill>
        </Link>
      ))}
    </div>
  )
}
