/**
 * paths — single source of truth for storefront routes.
 * Pages and nav import these instead of inlining URL strings.
 */
export const paths = {
  home: '/',
  login: '/login',
  search: '/search',
  categories: '/categories',
  cuisine: (slug: string) => `/cuisines/${slug}`,
  cuisines: '/cuisines',
  profile: '/profile',
  cart: '/cart',
  checkout: '/checkout',
  store: (storeId: string) => `/stores/${storeId}`,
  item: (storeId: string, itemId: string) => `/stores/${storeId}/items/${itemId}`,
  orders: '/orders',
  location: '/location',
  terms: '/terms',
  privacy: '/privacy',
  payment: '/account/payment',
  account: '/account',
  help: '/help',
  providerCategories: (providerId: string) => `/providers/${providerId}/categories`,
  filters: '/filters',
  health: '/health',
  compare: '/compare',
  sourceMenu: '/source-menu',
  dev: '/dev',
} as const

export function searchPath(query?: string, extras?: { category?: string; cuisine?: string }): string {
  const params = new URLSearchParams()
  const q = query?.trim()
  if (q) params.set('q', q)
  if (extras?.category) params.set('category', extras.category)
  if (extras?.cuisine) params.set('cuisine', extras.cuisine)
  const qs = params.toString()
  return qs ? `${paths.search}?${qs}` : paths.search
}
