/**
 * PromoBannerCarousel — top-of-home promo strip.
 * Every banner is tagged: "Sponsored" (paid placement) or "Deal" (organic promotion).
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import { useSponsoredTracking } from '@/hooks/home/useSponsoredEvents'
import { useDragScroll } from '@/hooks/utils/useDragScroll'
import { cn } from '@/lib/utils'
import { paths } from '@/routing/paths'
import type { HomeBanner } from '@/generated/data-model'

interface Props {
  banners: HomeBanner[]
  restaurantName: (restaurantId: string) => string | undefined
}

export default function PromoBannerCarousel({ banners, restaurantName }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const programmaticScroll = useRef(false)
  const dragScroll = useDragScroll(scroller)
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
  }, [banners.length])

  if (banners.length === 0) return null

  const movePage = (direction: 1 | -1) => {
    const node = scroller.current
    if (!node) return

    const firstCard = node.firstElementChild
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 0
    const gap = Number.parseFloat(getComputedStyle(node).columnGap) || 0
    const step = (cardWidth + gap) * 4
    const maxScroll = node.scrollWidth - node.clientWidth
    const left = direction > 0 && banners.length < 8 && node.scrollLeft < 1
      ? maxScroll
      : node.scrollLeft + direction * step
    const targetLeft = Math.max(0, Math.min(maxScroll, left))

    programmaticScroll.current = true
    setCanGoBack(targetLeft > 1)
    setCanGoForward(targetLeft < maxScroll - 1)
    node.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }

  return (
    <section aria-label="Promotions" className="relative">
      <div ref={dragScroll} className="flex gap-4 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none">
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} restaurantName={restaurantName(banner.restaurantId)} />
        ))}
      </div>
      {banners.length > 4 && canGoBack && (
        <ArrowButton side="left" onClick={() => movePage(-1)} />
      )}
      {banners.length > 4 && canGoForward && (
        <ArrowButton side="right" onClick={() => movePage(1)} />
      )}
    </section>
  )
}

function BannerCard({ banner, restaurantName }: { banner: HomeBanner; restaurantName?: string }) {
  const tracking = useSponsoredTracking<HTMLAnchorElement>(banner.sponsored, 'home')
  const isSponsored = banner.sponsored != null
  const tag = isSponsored ? banner.sponsored?.label || 'Sponsored' : banner.deal ? 'Deal' : 'Explore'
  const to = banner.restaurantId ? paths.store(banner.restaurantId) : paths.home

  return (
    <Link
      ref={tracking.ref}
      to={to}
      onClick={tracking.onClick}
      className={cn(
        'relative flex h-44 w-full shrink-0 basis-full flex-col justify-between overflow-hidden rounded-2xl p-5 transition-opacity hover:opacity-95 small:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]',
        isSponsored ? 'bg-content text-surface' : 'bg-brand text-on-brand',
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[9rem] font-bold leading-none opacity-10"
      >
        {(restaurantName ?? banner.headline).slice(0, 1)}
      </span>

      <div className="relative flex items-center gap-2 text-xs font-semibold">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
            isSponsored ? 'bg-surface/15' : 'bg-on-brand/10',
          )}
        >
          {!isSponsored && <Tag size={12} />}
          {tag}
        </span>
        {restaurantName && <span className="opacity-80">{restaurantName}</span>}
      </div>

      <div className="relative max-w-[85%]">
        <h3 className="text-xl font-semibold leading-tight">{banner.headline}</h3>
        {banner.body && <p className="mt-1 line-clamp-2 text-sm opacity-85">{banner.body}</p>}
      </div>

      {banner.callToAction && (
        <span
          className={cn(
            'relative inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold',
            isSponsored ? 'bg-brand text-on-brand' : 'bg-on-brand text-brand',
          )}
        >
          {banner.callToAction}
        </span>
      )}
    </Link>
  )
}

function ArrowButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={side === 'left' ? 'Previous promotions' : 'Next promotions'}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-content shadow-md backdrop-blur transition-colors hover:bg-surface-raised',
        side === 'left' ? 'left-2' : 'right-2',
      )}
    >
      <Icon size={22} />
    </button>
  )
}
