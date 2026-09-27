/**
 * RestaurantRail — titled horizontal scroller of RestaurantCards for a home feed section.
 */
import type { ReactNode } from 'react'
import SectionHeader from '@/components/storefront/SectionHeader'
import { useDragScroll } from '@/hooks/utils/useDragScroll'

interface Props {
  title: string
  subtitle?: ReactNode
  to?: string
  children: ReactNode
}

export default function RestaurantRail({ title, subtitle, to, children }: Props) {
  const dragScroll = useDragScroll<HTMLDivElement>()
  return (
    <section>
      <SectionHeader title={title} to={to}>
        {subtitle}
      </SectionHeader>
      <div ref={dragScroll} className="-mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1 scrollbar-none max-small:-mx-5 max-small:scroll-px-5 max-small:px-5 small:gap-4">
        {children}
      </div>
    </section>
  )
}
