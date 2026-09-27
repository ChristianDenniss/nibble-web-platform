/**
 * RestaurantRail — titled horizontal scroller of RestaurantCards for a home feed section.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeader from '@/components/storefront/SectionHeader'
import { useDragScroll } from '@/hooks/utils/useDragScroll'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  subtitle?: ReactNode
  to?: string
  children: ReactNode
}

export default function RestaurantRail({ title, subtitle, to, children }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const dragScroll = useDragScroll(scroller)
  const programmaticScroll = useRef(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  useEffect(() => {
    const node = scroller.current
    if (!node) return

    const updateButtons = () => {
      setCanGoBack(node.scrollLeft > 1)
      setCanGoForward(node.scrollLeft + node.clientWidth < node.scrollWidth - 1)
    }
    const onScroll = () => {
      if (!programmaticScroll.current) updateButtons()
    }
    const onScrollEnd = () => {
      programmaticScroll.current = false
      updateButtons()
    }

    updateButtons()
    node.addEventListener('scroll', onScroll, { passive: true })
    node.addEventListener('scrollend', onScrollEnd)
    const resizeObserver = new ResizeObserver(updateButtons)
    resizeObserver.observe(node)
    return () => {
      node.removeEventListener('scroll', onScroll)
      node.removeEventListener('scrollend', onScrollEnd)
      resizeObserver.disconnect()
    }
  }, [children])

  const movePage = (direction: 1 | -1) => {
    const node = scroller.current
    if (!node) return

    const firstCard = node.firstElementChild
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 0
    const gap = Number.parseFloat(getComputedStyle(node).columnGap) || 0
    const step = (cardWidth + gap) * 3
    const maxScroll = node.scrollWidth - node.clientWidth
    const targetLeft = Math.max(0, Math.min(maxScroll, node.scrollLeft + direction * step))

    programmaticScroll.current = true
    setCanGoBack(targetLeft > 1)
    setCanGoForward(targetLeft < maxScroll - 1)
    node.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }

  return (
    <section>
      <SectionHeader title={title} to={to}>
        {subtitle}
      </SectionHeader>
      <div className="relative">
        <div ref={dragScroll} className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none small:gap-4">
          {children}
        </div>
        {canGoBack && <ArrowButton side="left" onClick={() => movePage(-1)} />}
        {canGoForward && <ArrowButton side="right" onClick={() => movePage(1)} />}
      </div>
    </section>
  )
}

function ArrowButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={side === 'left' ? 'Previous restaurants' : 'More restaurants'}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-20 -mt-12 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-content shadow-md backdrop-blur transition-colors hover:bg-surface-raised',
        side === 'left' ? 'left-2' : 'right-2',
      )}
    >
      <Icon size={24} />
    </button>
  )
}
