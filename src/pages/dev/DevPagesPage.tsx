/**
 * DevPagesPage — clickable sitemap of every storefront layout. Registered only in DEV.
 */
import { Link } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import PageTitle from '@/components/brand/PageTitle'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function DevPagesPage() {
  const { data } = useStorefront()
  const storeId = data?.restaurants[0]?.id ?? 'rest_koi'
  const itemId = data?.items.find((item) => item.restaurantId === storeId)?.id ?? 'item_koi_tuna'
  const providerId = data?.providers[0]?.id ?? 'prov_skip'
  const cuisineSlug = data?.cuisines[0]?.slug ?? 'sushi'

  const pages = [
    { label: 'Login / Sign up', to: paths.login },
    { label: 'Home / Landing', to: paths.home },
    { label: 'Search', to: `${paths.search}?q=sushi` },
    { label: 'Categories', to: paths.categories },
    { label: 'Cuisines index', to: paths.cuisines },
    { label: 'Cuisine (sushi)', to: paths.cuisine(cuisineSlug) },
    { label: 'Store', to: paths.store(storeId) },
    { label: 'Food item', to: paths.item(storeId, itemId) },
    { label: 'Cart', to: paths.cart },
    { label: 'Checkout', to: paths.checkout },
    { label: 'Profile', to: paths.profile },
    { label: 'Past orders', to: paths.orders },
    { label: 'Location', to: paths.location },
    { label: 'Payment', to: paths.payment },
    { label: 'Manage account', to: paths.account },
    { label: 'Help / FAQ', to: paths.help },
    { label: 'Terms', to: paths.terms },
    { label: 'Privacy', to: paths.privacy },
    { label: 'Provider categories', to: paths.providerCategories(providerId) },
    { label: 'Filters', to: paths.filters },
    { label: 'Health', to: paths.health },
  ]

  return (
    <div className="space-y-6">
      <PageTitle icon={<LayoutGrid size={20} />} title="Page layouts" count={pages.length} />
      <p className="text-sm text-content-secondary">
        DEV sitemap. Catalog data comes from enableMockDev() — nothing is seeded in api-engine.
      </p>
      <ul className="grid grid-cols-1 gap-2 small:grid-cols-2">
        {pages.map((page) => (
          <li key={page.to}>
            <Link
              to={page.to}
              className="block rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-content hover:bg-surface-brand-hover"
            >
              {page.label}
              <span className="mt-1 block text-xs font-normal text-content-muted">{page.to}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
