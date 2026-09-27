import catalog from '@/catalog/catalog.json'
import PromotionList from '@/components/storefront/PromotionList'
import MerchantOrdering from '@/components/storefront/MerchantOrdering'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { paths } from '@/routing/paths'
import RestaurantImage from '@/components/storefront/RestaurantImage'
/**
 * StorePage — single restaurant: cover, meta, provider availability, menu sections.
 * No breadcrumb; the info tip beside the name opens StoreInfoModal (hours + allergen disclaimer).
 * Every section renders in one scrolling list; the sticky tab bar jumps to a section
 * and tracks whichever section is currently under it (scroll-spy), never filters.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, Info, MapPin, Star } from 'lucide-react'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import OrderPathStack from '@/components/storefront/OrderPathStack'
import MenuItemCard from '@/components/storefront/MenuItemCard'
import StoreInfoModal from '@/components/storefront/StoreInfoModal'
import { currentAddress, restaurantCoverage, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { restaurantDistanceKm } from '@/lib/restaurantAvailability'
import { formatDeliveryTime } from '@/lib/deliveryTime'
import { useDragScroll } from '@/hooks/utils/useDragScroll'

/** Live sticky-header height published by Header; the tab bar sticks directly below it. */
const headerHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-header-height')) || 64

/** Minimum scroll distance each squeezed trailing section stays active for. */
const SPY_BAND_PX = 160

/**
 * Window scrollY at which each section becomes active. Trailing sections too close to the
 * page end to reach the sticky bar are pulled back from the bottom, each keeping at least a
 * band of scroll, so a short menu steps through every tab instead of jumping to the last.
 */
function sectionStops(names: string[], els: Map<string, HTMLElement>, offset: number): number[] {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
  const stops = names.map((name) => {
    const el = els.get(name)
    return el ? el.getBoundingClientRect().top + window.scrollY - offset : Infinity
  })
  const band = Math.min(SPY_BAND_PX, maxScroll / Math.max(names.length, 1))
  let next = maxScroll + band
  for (let i = stops.length - 1; i >= 0; i--) {
    const capped = Math.min(stops[i], next - band)
    if (capped === stops[i]) break
    stops[i] = capped
    next = capped
  }
  return stops
}

export default function StorePage() {
  const { storeId = '' } = useParams()
  const cart = useCartDraft()
  const { loading, data, error } = useStorefront()
  const [active, setActive] = useState<string | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const stickyBar = useRef<HTMLDivElement>(null)
  const tabBar = useRef<HTMLDivElement>(null)
  const dragTabBar = useDragScroll(tabBar)
  const sectionEls = useRef(new Map<string, HTMLElement>())
  const scrollingToTab = useRef(false)
  const settleTimer = useRef<number | undefined>(undefined)

  const restaurant = data?.restaurants.find((entry) => entry.id === storeId)
  // Keyed on data.items, not data: useStorefront hands back a new data object every render,
  // which would rebuild `sections` and restart scroll-spy mid-scroll.
  const allItems = data?.items
  const items = useMemo(() => (allItems ?? []).filter((item) => item.restaurantId === storeId), [allItems, storeId])
  const grouped = useMemo(() => {
    const bySection = new Map<string, typeof items>()
    for (const item of items) bySection.set(item.section, [...(bySection.get(item.section) ?? []), item])
    return [...bySection.entries()]
  }, [items])
  const sections = useMemo(() => grouped.map(([name]) => name), [grouped])

  const stickyOffset = () => headerHeight() + (stickyBar.current?.offsetHeight ?? 0)

  /** Keeps scroll-spy paused while a tab-triggered smooth scroll is still moving. */
  const holdScrollSpy = () => {
    scrollingToTab.current = true
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => { scrollingToTab.current = false }, 150)
  }

  useEffect(() => {
    if (sections.length === 0) return
    let frame = 0
    const update = () => {
      frame = 0
      if (scrollingToTab.current) return
      const stops = sectionStops(sections, sectionEls.current, stickyOffset())
      let current = sections[0]
      stops.forEach((stop, index) => {
        if (window.scrollY >= stop - 1) current = sections[index]
      })
      setActive(current)
    }
    const onScroll = () => {
      if (scrollingToTab.current) {
        holdScrollSpy()
        return
      }
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer.current)
    }
  }, [sections])

  useEffect(() => {
    const bar = tabBar.current
    const index = active ? sections.indexOf(active) : -1
    const tab = index >= 0 ? (bar?.children[index] as HTMLElement | undefined) : undefined
    if (!bar || !tab) return
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }, [active, sections])

  const jumpTo = (name: string) => {
    const stop = sectionStops(sections, sectionEls.current, stickyOffset())[sections.indexOf(name)]
    if (stop == null || !Number.isFinite(stop)) return
    setActive(name)
    holdScrollSpy()
    window.scrollTo({ top: stop + 1, behavior: 'smooth' })
  }

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Store unavailable" description={error ?? undefined} />
  if (!restaurant) return <EmptyState title="Store not found" />

  const serviceability = restaurantCoverage(data, restaurant.id)
  const providers = restaurantProviders(data, restaurant.id)
  const providerStatus = Object.fromEntries(
    serviceability?.paths.map((path) => [path.providerId, path.status]) ?? [],
  ) as Record<string, 'covered' | 'unavailable' | 'unknown'>
  const eta = restaurantEta(data, restaurant.id)
  const address = currentAddress(data)
  const distance = restaurantDistanceKm(restaurant, address)
  const ratings: Record<string, { provider: string; sourceUrl: string }> = catalog.ratings
  const ratingSource = ratings[restaurant.id]
  const providerScores: Record<string, { provider: string; sourceUrl: string; value: string | number; scale: number }[]> = catalog.providerScores

  return (
    <div className="space-y-6">
      <RestaurantImage restaurantId={restaurant.id} name={restaurant.name} imageURL={restaurant.imageURL} className="h-48 w-full rounded-2xl" />
      <div className="flex flex-col gap-3 small:flex-row small:items-end small:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-content">{restaurant.name}</h1>
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              aria-label="Store info: hours and allergens"
              title="Hours and allergens"
              className="cursor-pointer rounded-full p-1 text-content-muted transition-colors hover:bg-surface-inset hover:text-content"
            >
              <Info size={18} />
            </button>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-content-secondary">
            {restaurant.rating.count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="text-status-warning" />
                {restaurant.rating.average.toFixed(1)} / 5 ({restaurant.rating.count.toLocaleString()})
                {ratingSource && <a className="underline" href={ratingSource.sourceUrl} target="_blank" rel="noopener noreferrer">{ratingSource.provider}</a>}
              </span>
            )}
            {(providerScores[restaurant.id] ?? []).map(score => <a key={score.provider} href={score.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{score.provider} score: {score.value}/{score.scale}</a>)}
            {eta && (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {formatDeliveryTime(eta.min, eta.max)}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {restaurant.location.address}
            </span>
            {distance != null && <span>{distance.toFixed(1)} km away</span>}
          </p>
        </div>
        <OrderPathStack restaurant={restaurant} providers={providers} providerStatus={providerStatus} size="md" className="self-start small:self-auto" />
      </div>

      <MerchantOrdering restaurantId={restaurant.id} />
      <PromotionList providerIds={[...providers.map(provider => provider.id), ...(restaurant.appURL ? ['prov_direct'] : [])]} restaurantName={restaurant.name} />

      {sections.length > 0 && (
        <div ref={stickyBar} className="sticky top-(--app-header-height) z-20 -mx-5 border-b border-border bg-page px-5 pb-1.5 pt-2.5">
          <div ref={dragTabBar} role="tablist" className="relative flex gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain scrollbar-thin pb-1">
            {sections.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={active === name}
                onClick={() => jumpTo(name)}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active === name ? 'bg-content text-page' : 'text-content hover:bg-surface-inset'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="small:space-y-8">
        {grouped.map(([name, sectionItems]) => (
          <section
            key={name}
            ref={(el) => { if (el) sectionEls.current.set(name, el); else sectionEls.current.delete(name) }}
          >
            <h2 className="-mx-5 bg-page px-5 pb-4 pt-8 text-xl font-bold tracking-tight text-content small:mx-0 small:mb-3 small:px-0 small:pb-0 small:pt-0 small:text-lg">
              {name}
            </h2>
            <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 small:gap-3">
              {sectionItems.map((item) => {
                const prices = data.offers.filter((offer) => offer.menuItemId === item.id).map((offer) => offer.price.amountCents)
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    storeId={restaurant.id}
                    priceCents={prices.length ? Math.min(...prices) : null}
                    tinted
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>
      {!!cart.lines.length && <div className="sticky bottom-4 z-30 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 shadow-xl"><span className="font-semibold">{cart.lines.reduce((n, line) => n + line.quantity, 0)} items in your cart</span><Link to={paths.cart} className="rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-on-brand">Review cart</Link></div>}
      <p className="text-xs text-content-muted">Some photos are illustrative; portions and presentation may vary. Available menu entries and options can differ by ordering service.</p>
      <StoreInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} restaurant={restaurant} />
    </div>
  )
}
