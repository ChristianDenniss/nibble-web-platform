/**
 * RestaurantRail — titled horizontal scroller of RestaurantCards for a home feed section.
 */
import type { ReactNode } from 'react'
import SectionHeader from '@/components/storefront/SectionHeader'

interface Props {
  title: string
  subtitle?: ReactNode
  to?: string
  children: ReactNode
}

export default function RestaurantRail({ title, subtitle, to, children }: Props) {
  return (
    <section>
      <SectionHeader title={title} to={to}>
        {subtitle}
      </SectionHeader>
      <div className="grid grid-cols-1 gap-3 small:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 small:gap-4">
        {children}
      </div>
    </section>
  )
}
