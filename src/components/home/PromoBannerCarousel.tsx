/**
 * PromoBannerCarousel — top-of-home promo strip.
 * Every banner is tagged: "Sponsored" (paid placement) or "Deal" (organic promotion).
 */
import { useRef } from 'react'
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
  const dragScroll = useDragScroll(scroller)
  if (banners.length === 0) return null

  const scrollBy = (direction: 1 | -1) => {
    const node = scroller.current
    if (node) node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section aria-label="Promotions" className="relative">
      <div ref={dragScroll} className="flex gap-4 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none">
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} restaurantName={restaurantName(banner.restaurantId)} />
        ))}
      </div>
      {banners.length > 2 && (
        <>
          <ArrowButton side="left" onClick={() => scrollBy(-1)} />
          <ArrowButton side="right" onClick={() => scrollBy(1)} />
        </>
      )}
    </section>
  )
}

function BannerCard({ banner, restaurantName }: { banner: HomeBanner; restaurantName?: string }) {
  const tracking = useSponsoredTracking<HTMLAnchorElement>(banner.sponsored, 'home')
  const isSponsored = banner.sponsored != null
  const tag = isSponsored ? banner.sponsored?.label || 'Sponsored' : 'Deal'
  const to = banner.restaurantId ? paths.store(banner.restaurantId) : paths.home

  return (
    <Link
      ref={tracking.ref}
      to={to}
      onClick={tracking.onClick}
      className={cn(
        'relative flex h-44 w-[85%] shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-5 transition-opacity hover:opacity-95 small:w-[26rem]',
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
        'absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-content shadow-md transition-colors hover:bg-surface-raised small:inline-flex',
        side === 'left' ? '-left-3' : '-right-3',
      )}
    >
      <Icon size={18} />
    </button>
  )
}
