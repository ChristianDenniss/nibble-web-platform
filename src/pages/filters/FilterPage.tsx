/**
 * FilterPage — full-page sort / price / rating / dietary / ETA controls.
 * Chip labels are UI chrome, not domain types.
 */
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import Button from '@/components/buttons/Button'
import Pill from '@/components/pills/Pill'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import { lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths, searchPath } from '@/routing/paths'

type FilterGroup = 'sort' | 'price' | 'rating' | 'dietary' | 'eta'

const FILTERS: { id: string; label: string; group: FilterGroup }[] = [
  { id: 'sort_rec', label: 'Recommended', group: 'sort' },
  { id: 'sort_eta', label: 'Fastest', group: 'sort' },
  { id: 'sort_rating', label: 'Highest rated', group: 'sort' },
  { id: 'price_1', label: '$', group: 'price' },
  { id: 'price_2', label: '$$', group: 'price' },
  { id: 'price_3', label: '$$$', group: 'price' },
  { id: 'rating_4', label: '4.0+', group: 'rating' },
  { id: 'rating_45', label: '4.5+', group: 'rating' },
  { id: 'diet_veg', label: 'Vegetarian', group: 'dietary' },
  { id: 'diet_gf', label: 'Gluten-free', group: 'dietary' },
  { id: 'eta_20', label: 'Under 20 min', group: 'eta' },
  { id: 'eta_30', label: 'Under 30 min', group: 'eta' },
]

const GROUPS: FilterGroup[] = ['sort', 'price', 'rating', 'dietary', 'eta']
const GROUP_LABEL: Record<FilterGroup, string> = {
  sort: 'Sort',
  price: 'Price',
  rating: 'Rating',
  dietary: 'Dietary',
  eta: 'Delivery time',
}

export default function FilterPage() {
  const { loading, data, error } = useStorefront()
  const navigate = useNavigate()
  const [active, setActive] = useState<string[]>(['sort_rec'])

  const preview = useMemo(() => {
    if (!data) return []
    let restaurants = [...data.restaurants]
    if (active.includes('rating_45')) restaurants = restaurants.filter((restaurant) => restaurant.rating.average >= 4.5)
    else if (active.includes('rating_4')) restaurants = restaurants.filter((restaurant) => restaurant.rating.average >= 4)
    if (active.includes('eta_20')) restaurants = restaurants.filter((restaurant) => (restaurantEta(data, restaurant.id)?.max ?? 99) <= 20)
    else if (active.includes('eta_30')) restaurants = restaurants.filter((restaurant) => (restaurantEta(data, restaurant.id)?.max ?? 99) <= 30)
    if (active.includes('sort_rating')) restaurants.sort((a, b) => b.rating.average - a.rating.average)
    if (active.includes('sort_eta')) {
      restaurants.sort((a, b) => (restaurantEta(data, a.id)?.min ?? 99) - (restaurantEta(data, b.id)?.min ?? 99))
    }
    return restaurants
  }, [data, active])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Filters unavailable" description={error ?? undefined} />

  const toggle = (id: string, group: FilterGroup) => {
    setActive((current) => {
      const withoutGroup = current.filter((value) => FILTERS.find((entry) => entry.id === value)?.group !== group)
      if (current.includes(id) && group !== 'sort') return withoutGroup
      return [...withoutGroup, id]
    })
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Filters' }]} />
      <PageTitle icon={<SlidersHorizontal size={20} />} title="Filters" />
      {GROUPS.map((group) => (
        <section key={group}>
          <h2 className="mb-2 text-sm font-semibold text-content">{GROUP_LABEL[group]}</h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.filter((preset) => preset.group === group).map((preset) => (
              <Pill
                key={preset.id}
                accent={active.includes(preset.id)}
                onClick={() => toggle(preset.id, group)}
              >
                {preset.label}
              </Pill>
            ))}
          </div>
        </section>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => navigate(searchPath())}>Apply to search</Button>
        <Button variant="secondary" onClick={() => setActive(['sort_rec'])}>Clear</Button>
        <Link to={paths.home} className="text-sm font-medium text-accent self-center">Back to home</Link>
      </div>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-content">{preview.length} matching restaurants</h2>
        <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
          {preview.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              startingCents={lowestOfferCents(data, restaurant.id)}
              etaMin={restaurantEta(data, restaurant.id)?.min}
              etaMax={restaurantEta(data, restaurant.id)?.max}
              providers={restaurantProviders(data, restaurant.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
