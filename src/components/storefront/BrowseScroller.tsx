/**
 * BrowseScroller — horizontal snap-scroll rail of compact browse tiles.
 */
import type { ReactNode } from 'react'
import SectionHeader from './SectionHeader'

interface Props {
  title: string
  to?: string
  children: ReactNode
}

export default function BrowseScroller({ title, to, children }: Props) {
  return (
    <section>
      <SectionHeader title={title} to={to} />
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 scrollbar-none">
        {children}
      </div>
    </section>
  )
}
