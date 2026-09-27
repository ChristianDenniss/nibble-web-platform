/**
 * SearchPage — query results for restaurants and dishes, with a jump to filters.
 * Category landings add cuisine chips and lead with the restaurant feed.
 */
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import axios from 'axios'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import CuisineChips from '@/components/storefront/CuisineChips'
import MenuItemCard from '@/components/storefront/MenuItemCard'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import SectionHeader from '@/components/storefront/SectionHeader'
import Pagination from '@/components/navigation/Pagination'
import SearchFiltersModal from '@/components/search/SearchFiltersModal'
import { extractAxiosError } from '@/errors'
import { lowestOfferCents, restaurantEta, restaurantProviders, useStorefront } from '@/hooks/storefront/useStorefront'
import { searchPath } from '@/routing/paths'
import type { Item, Restaurant } from '@/generated/data-model'

interface PageResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const categorySlug = params.get('category')
  const cuisineSlug = params.get('cuisine')
  const { loading, data, error } = useStorefront({ lightweight: true })
  const hasStorefrontData = data !== null
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>(['sort_rec'])
  const [page, setPage] = useState(1)
  const [results, setResults] = useState<{ restaurants: PageResult<Restaurant>; items: PageResult<Item> } | null>(null)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [q, categorySlug, cuisineSlug])

  useEffect(() => {
    if (!hasStorefrontData) return
    let cancelled = false
    setResultsLoading(true)
    setResultsError(null)
    const query = {
      q: q || undefined,
      category: categorySlug || undefined,
      cuisine: cuisineSlug || undefined,
      sort: activeFilters.includes('sort_rating') ? 'rating' : activeFilters.includes('sort_eta') ? 'eta' : undefined,
      page,
      pageSize: 12,
    }
    Promise.all([
      axios.get<PageResult<Restaurant>>('/api/v1/restaurants', { params: query }),
      axios.get<PageResult<Item>>('/api/v1/menu-items', { params: query }),
    ])
      .then(([restaurants, items]) => {
        if (!cancelled) setResults({ restaurants: restaurants.data, items: items.data })
      })
      .catch((err: unknown) => {
        if (!cancelled) setResultsError(extractAxiosError(err, 'search failed to load'))
      })
      .finally(() => {
        if (!cancelled) setResultsLoading(false)
      })
    return () => { cancelled = true }
  }, [hasStorefrontData, q, categorySlug, cuisineSlug, page, activeFilters])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Search is unavailable" description={error ?? undefined} />

  const category = data.categories.find((entry) => entry.slug === categorySlug)
  const cuisine = data.cuisines.find((entry) => entry.slug === cuisineSlug)
  const restaurantResults = results?.restaurants
  const itemResults = results?.items
  const heading = q
    ? `Results for “${q}”`
    : category
      ? category.name
      : 'Search'
  const categoryBrowse = Boolean(categorySlug && !q)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">{heading}</h1>
          <p className="mt-1 text-sm text-content-secondary">
            {restaurantResults?.total ?? 0} restaurants
            {!categoryBrowse && ` · ${itemResults?.total ?? 0} dishes`}
            {cuisine && ` · ${cuisine.name}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-surface-inset px-4 text-sm font-medium text-content-secondary hover:bg-surface-raised"
        >
          <SlidersHorizontal size={14} />
          Sort
        </button>
      </div>

      <SearchFiltersModal
        open={filtersOpen}
        active={activeFilters}
        onClose={() => setFiltersOpen(false)}
        onApply={(filters) => {
          setActiveFilters(filters)
          setPage(1)
        }}
      />

      {categorySlug && (
        <CuisineChips
          cuisines={data.cuisines}
          activeSlug={cuisineSlug}
          allHref={searchPath(q || undefined, { category: categorySlug })}
          hrefFor={(slug) => searchPath(q || undefined, {
            category: categorySlug,
            cuisine: slug === cuisineSlug ? undefined : slug,
          })}
          className="sticky top-(--app-header-height) z-20 -mx-5 bg-page px-5 py-2"
        />
      )}

      <section>
        <SectionHeader title="Restaurants" />
        {resultsLoading ? <PageLoader /> : resultsError ? (
          <EmptyState title="Search is unavailable" description={resultsError} />
        ) : restaurantResults?.data.length === 0 ? (
          <EmptyState title="No restaurants match" description="Try another search or clear filters." />
        ) : (
          <div className="grid grid-cols-1 gap-5 small:grid-cols-2">
            {restaurantResults?.data.map((restaurant) => (
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
        )}
        {restaurantResults && restaurantResults.totalPages > 1 && (
          <Pagination page={restaurantResults.page} totalPages={restaurantResults.totalPages} onPageChange={setPage} className="mt-5" />
        )}
      </section>

      <section>
        <SectionHeader title="Dishes" />
        {resultsLoading ? <PageLoader /> : resultsError ? (
          <EmptyState title="Search is unavailable" description={resultsError} />
        ) : results?.items.data.length === 0 ? (
          <EmptyState title="No dishes match" />
        ) : (
          <div className="grid grid-cols-1 small:grid-cols-2 small:gap-3">
            {results?.items.data.map((item) => {
              const price = data.offers
                .filter((offer) => offer.menuItemId === item.id)
                .map((offer) => offer.price.amountCents)
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  storeId={item.restaurantId}
                  priceCents={price.length ? Math.min(...price) : null}
                />
              )
            })}
          </div>
        )}
        {results && results.items.totalPages > 1 && (
          <Pagination page={results.items.page} totalPages={results.items.totalPages} onPageChange={setPage} className="mt-5" />
        )}
      </section>
    </div>
  )
}
