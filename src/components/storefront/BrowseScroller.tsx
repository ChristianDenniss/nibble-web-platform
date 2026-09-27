/**
 * BrowseScroller — untitled horizontal snap-scroll rail of compact browse tiles.
 * The tiles speak for themselves; `label` only names the rail for screen readers.
 */
import type { ReactNode } from 'react'
import { useDragScroll } from '@/hooks/utils/useDragScroll'

interface Props {
  label: string
  children: ReactNode
}

export default function BrowseScroller({ label, children }: Props) {
  const dragScroll = useDragScroll<HTMLDivElement>()
  return (
    <section aria-label={label}>
      <div ref={dragScroll} className="-mx-5 flex snap-x snap-proximity scroll-pl-5 scroll-pr-8 gap-3 overflow-x-auto overscroll-x-contain pl-5 pr-8 pb-1 scrollbar-none">
        {children}
      </div>
    </section>
  )
}
