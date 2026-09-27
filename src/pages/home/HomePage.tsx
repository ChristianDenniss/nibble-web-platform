/**
 * HomePage — promo banners, browse rails, sponsored + fastest + organic feed rails
 * (deals, popular, recommended), then the full "All restaurants" list last.
 * Guests see the /welcome splash once per browser session; signed-in users always land here directly.
 */
import { Navigate } from 'react-router-dom'
import PromoBannerCarousel from '@/components/home/PromoBannerCarousel'
import RestaurantRail from '@/components/home/RestaurantRail'
import PageLoader from '@/components/layout/PageLoader'
import EmptyState from '@/components/misc/EmptyState'
import BrowseScroller from '@/components/storefront/BrowseScroller'
import CategoryTile from '@/components/storefront/CategoryTile'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import SectionHeader from '@/components/storefront/SectionHeader'
import { useAuth } from '@/hooks/auth/authStore'
import { resolveFeedItems, useHomeFeed } from '@/hooks/home/useHomeFeed'
import { hasSeenSplash } from '@/hooks/onboarding/onboardingStore'
import {
  lowestOfferCents,
  restaurantEta,
  restaurantProviders,
  currentAddress,
  restaurantCoverage,
  useStorefront,
  type StorefrontData,
} from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'
import type { HomeSection, Restaurant, SponsoredMark } from '@/generated/data-model'
import { restaurantDistanceKm, type CoverageStatus } from '@/lib/restaurantAvailability'
import { coverTone } from '@/lib/coverTone'

const FASTEST_LIMIT = 8
const RAIL_CARD_CLASS = 'w-full min-w-0 shrink-0 basis-full small:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]'

export default function HomePage() {
  const { status } = useAuth()
  if (status === 'loading') return <PageLoader />
  if (status === 'guest' && !hasSeenSplash()) return <Navigate to={paths.welcome} replace />
  return <HomeFeedView />
}

function HomeFeedView() {
  // Home cards need offers to render provider badges and ETA/price metadata.
  // The lightweight bootstrap intentionally omits offers, so use the full
  // storefront read model for this feed.
  const { loading, data, error } = useStorefront({ includeRestaurants: true })
  const { feed } = useHomeFeed()

  if (loading) return <PageLoader />
  if (!data) {
    return <EmptyState title="Nothing to browse yet" description={error ?? 'Storefront catalog is empty.'} />
  }

  const restaurantName = (id: string) => data.restaurants.find((restaurant) => restaurant.id === id)?.name
  const sections = feed?.sections ?? []
  const sponsoredSections = sections.filter((section) => section.kind === 'sponsored')
  const organicSections = sections.filter((section) => section.kind !== 'sponsored')
  const fastest = fastestRestaurants(data, FASTEST_LIMIT)
  const address = currentAddress(data)
  const banners = (feed?.banners ?? []).filter((banner) => {
    const restaurant = data.restaurants.find((entry) => entry.id === banner.restaurantId)
    return !restaurant || cardCoverageStatus(data, restaurant.id) !== 'unavailable'
  })
  const restaurants = [...data.restaurants].sort((a, b) => {
    const aDistance = restaurantDistanceKm(a, address) ?? Number.POSITIVE_INFINITY
    const bDistance = restaurantDistanceKm(b, address) ?? Number.POSITIVE_INFINITY
    const aStatus = cardCoverageStatus(data, a.id)
    const bStatus = cardCoverageStatus(data, b.id)
    return coverageRank(aStatus) - coverageRank(bStatus) || aDistance - bDistance
  })
  const cuisinePopularity = new Map(
    data.cuisines.map((cuisine) => [
      cuisine.id,
      data.restaurants.reduce(
        (total, restaurant) => total + (restaurant.cuisineIds.includes(cuisine.id) ? restaurant.rating.count : 0),
        0,
      ),
    ]),
  )
  const cuisineCandidates = data.cuisines
    .filter((cuisine) => cuisine.slug !== 'bbq')
    .map((cuisine, originalOrder) => ({ cuisine, originalOrder }))
    .sort((a, b) =>
      (cuisinePopularity.get(b.cuisine.id) ?? 0) - (cuisinePopularity.get(a.cuisine.id) ?? 0)
      || a.originalOrder - b.originalOrder,
    )
  const popularCuisines = [] as typeof data.cuisines
  let previousCuisineTone: ReturnType<typeof coverTone> | undefined
  while (cuisineCandidates.length > 0) {
    const differentToneIndex = cuisineCandidates.findIndex(
      ({ cuisine }) => coverTone(cuisine.id) !== previousCuisineTone,
    )
    const [next] = cuisineCandidates.splice(differentToneIndex < 0 ? 0 : differentToneIndex, 1)
    if (!next) break
    popularCuisines.push(next.cuisine)
    previousCuisineTone = coverTone(next.cuisine.id)
  }
  const breakfastIndex = popularCuisines.findIndex((cuisine) => cuisine.slug === 'breakfast')
  const displayedCuisines = breakfastIndex < 0
    ? popularCuisines
    : popularCuisines.slice(0, breakfastIndex + 1)

  return (
    <div className="space-y-10 xl:-mx-6">
      <h1 className="sr-only">Home</h1>

      <div className="space-y-6">
        {feed && <PromoBannerCarousel banners={banners} restaurantName={restaurantName} />}

        {data.cuisines.length > 0 && (
          <section>
            <SectionHeader title="Cuisines" />
            <BrowseScroller label="Cuisines">
              {displayedCuisines.map((cuisine) => (
                <CategoryTile
                  key={cuisine.id}
                  item={cuisine}
                  to={paths.cuisine(cuisine.slug)}
                  variant="compact"
                  className="shrink-0"
                />
              ))}
            </BrowseScroller>
          </section>
        )}

        {sponsoredSections.map((section) => (
          <FeedRail key={section.kind} data={data} section={section} />
        ))}
      </div>

      {fastest.length > 0 && (
        <RestaurantRail title="Fastest near you">
          {fastest.map((restaurant) => (
            <FeedCard key={restaurant.id} data={data} restaurant={restaurant} className={RAIL_CARD_CLASS} />
          ))}
        </RestaurantRail>
      )}

      {organicSections.map((section) => (
        <FeedRail key={section.kind} data={data} section={section} />
      ))}

      {data.restaurants.length > 0 && (
        <section>
          <SectionHeader title="All restaurants" />
          <div className="grid grid-cols-1 gap-5 small:grid-cols-2 xl:grid-cols-4">
            {restaurants.map((restaurant) => (
              <FeedCard key={restaurant.id} data={data} restaurant={restaurant} address={address} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function FeedRail({ data, section }: { data: StorefrontData; section: HomeSection }) {
  const items = resolveFeedItems(section.items, data.restaurants).filter(
    ({ restaurant }) => cardCoverageStatus(data, restaurant.id) !== 'unavailable',
  )
  if (items.length === 0) return null
  if (section.kind === 'recommended') {
    const masalaIndex = items.findIndex(({ restaurant }) => restaurant.id === 'rest_masala')
    const stackIndex = items.findIndex(({ restaurant }) => restaurant.id === 'rest_stack')
    if (masalaIndex >= 0 && stackIndex >= 0) {
      const masala = items[masalaIndex]
      const stack = items[stackIndex]
      if (masala && stack) {
        items[masalaIndex] = stack
        items[stackIndex] = masala
      }
    }
  }
  return (
    <RestaurantRail
      title={section.title}
      subtitle={
        section.kind === 'sponsored' ? (
          <p className="text-xs text-content-muted">
            Paid placements. They never change prices, compare results, or recommendations.
          </p>
        ) : undefined
      }
    >
      {items.map(({ item, restaurant }) => (
        <FeedCard
          key={`${section.kind}-${item.restaurantId}`}
          data={data}
          restaurant={restaurant}
          sponsored={item.sponsored}
          reason={item.reason}
          className={RAIL_CARD_CLASS}
        />
      ))}
    </RestaurantRail>
  )
}

/** Quickest first by the lowest provider ETA; restaurants with no ETA are left out. */
function fastestRestaurants(data: StorefrontData, limit: number): Restaurant[] {
  return data.restaurants
    .flatMap((restaurant) => {
      if (cardCoverageStatus(data, restaurant.id) === 'unavailable') return []
      const eta = restaurantEta(data, restaurant.id)
      return eta ? [{ restaurant, eta }] : []
    })
    .sort((a, b) => a.eta.min - b.eta.min || a.eta.max - b.eta.max)
    .slice(0, limit)
    .map(({ restaurant }) => restaurant)
}

interface FeedCardProps {
  data: StorefrontData
  restaurant: Restaurant
  sponsored?: SponsoredMark | null
  reason?: string
  className?: string
}

function FeedCard({ data, restaurant, address, ...rest }: FeedCardProps & { address?: ReturnType<typeof currentAddress> }) {
  const eta = restaurantEta(data, restaurant.id)
  const coverage = cardCoverageStatus(data, restaurant.id)
  return (
    <RestaurantCard
      restaurant={restaurant}
      startingCents={lowestOfferCents(data, restaurant.id)}
      etaMin={eta?.min}
      etaMax={eta?.max}
      providers={restaurantProviders(data, restaurant.id)}
      providerStatus={providerStatuses(data, restaurant.id)}
      distanceKm={restaurantDistanceKm(restaurant, address ?? currentAddress(data))}
      coverage={coverage}
      {...rest}
    />
  )
}

function cardCoverageStatus(data: StorefrontData, restaurantId: string): CoverageStatus {
  const coverage = restaurantCoverage(data, restaurantId)
  if (!coverage || coverage.paths.length === 0) return 'unknown'
  if (coverage.paths.some((path) => path.status === 'covered')) return 'covered'
  if (coverage.paths.every((path) => path.status === 'unavailable')) return 'unavailable'
  return 'unknown'
}

function coverageRank(status: CoverageStatus): number {
  if (status === 'covered') return 0
  if (status === 'unknown') return 1
  return 2
}

function providerStatuses(data: StorefrontData, restaurantId: string) {
  const coverage = restaurantCoverage(data, restaurantId)
  return Object.fromEntries(coverage?.paths.map((path) => [path.providerId, path.status]) ?? []) as Record<string, 'covered' | 'unavailable' | 'unknown'>
}
