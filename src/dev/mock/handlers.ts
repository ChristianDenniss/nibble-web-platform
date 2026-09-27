/**
 * URL matchers for the DEV mock adapter.
 * Keep this the only place that knows which /api paths the catalog can answer.
 */
import type { InternalAxiosRequestConfig } from 'axios'
import { resolveAuthMock, mockSessionAccount } from './auth'
import { mockAccount, mockCatalog, mockCart, mockHomeFeed } from './catalog'

export interface MockResult {
  status: number
  data: unknown
}

function pathOf(config: InternalAxiosRequestConfig): string {
  const raw = config.url ?? ''
  try {
    if (raw.startsWith('http')) return new URL(raw).pathname
  } catch {
    /* use raw */
  }
  return raw.split('?')[0] ?? raw
}

function queryValue(config: InternalAxiosRequestConfig, key: string): string {

  const params = config.params as Record<string, unknown> | undefined
  const value = params?.[key]
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : ''
}

function pageOf<T>(items: T[], config: InternalAxiosRequestConfig) {
  const pageSize = Math.min(Math.max(Number(queryValue(config, 'pageSize')) || 12, 1), 100)
  const page = Math.max(Number(queryValue(config, 'page')) || 1, 1)
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1)
  return {
    data: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages,
  }
}

const mockSourceStores = [
  {
    id: 'ss_store',
    channelId: 'ch_store',
    externalStoreId: 'ext-store-1',
    name: 'Demo store direct',
    location: { latitude: 45.9636, longitude: -66.6431, address: '' },
    phone: '',
  },
  {
    id: 'ss_skip',
    channelId: 'ch_skip',
    externalStoreId: 'ext-skip-1',
    name: 'Demo via Skip',
    location: { latitude: 45.9636, longitude: -66.6431, address: '' },
    phone: '',
  },
]

const addressRoute =
  /^\/api\/v1\/accounts\/[^/]+\/addresses\/([^/]+)(?:\/current)?$/

export function resolveMock(config: InternalAxiosRequestConfig): MockResult | null {
  const path = pathOf(config)
  const method = (config.method ?? 'get').toLowerCase()

  const auth = resolveAuthMock(method, path, config.data)
  if (auth) return auth

  if (method === 'put' && (path === '/api/v1/cart' || path === '/cart')) {
    try {
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      mockCart.lines = Array.isArray(body?.lines) ? body.lines : []
      if (body?.id) mockCart.id = body.id
      return { status: 200, data: mockCart }
    } catch {
      return { status: 400, data: { error: 'invalid json' } }
    }
  }

  if (method === 'post' && (path === '/api/v1/cart/events' || path === '/cart/events')) {
    return { status: 202, data: { status: 'accepted' } }
  }

  if (method === 'get') {
    if (path === '/api/v1/storefront' || path === '/api/storefront' || path === '/storefront' || path === '/v1/storefront') {
      const lightweight = queryValue(config, 'lightweight') === 'true'
      return {
        status: 200,
        data: {
          ...mockCatalog,
          account: mockSessionAccount(),
          ...(lightweight ? { restaurants: [], items: [], offers: [], orders: [] } : {}),
        },
      }
    }

    if (path === '/api/v1/restaurants' || path === '/api/v1/menu-items') {
      const search = queryValue(config, 'q').toLowerCase()
      const category = queryValue(config, 'category')
      const cuisine = queryValue(config, 'cuisine')
      const categoryId = mockCatalog.categories.find((entry) => entry.slug === category)?.id
      const cuisineId = mockCatalog.cuisines.find((entry) => entry.slug === cuisine)?.id
      const restaurants = mockCatalog.restaurants.filter((restaurant) =>
        (!search || `${restaurant.name} ${restaurant.cuisineIds.map((id) => mockCatalog.cuisines.find((entry) => entry.id === id)?.name ?? '').join(' ')}`.toLowerCase().includes(search)) &&
        (!categoryId || restaurant.categoryIds.includes(categoryId)) &&
        (!cuisineId || restaurant.cuisineIds.includes(cuisineId)),
      )
      if (path === '/api/v1/restaurants') return { status: 200, data: pageOf(restaurants, config) }
      const restaurantIds = new Set(restaurants.map((restaurant) => restaurant.id))
      const restaurantId = queryValue(config, 'restaurantId')
      const items = mockCatalog.items.filter((item) =>
        restaurantIds.has(item.restaurantId) && (!restaurantId || item.restaurantId === restaurantId) &&
        (!search || `${item.name} ${item.description}`.toLowerCase().includes(search)),
      )
      return { status: 200, data: pageOf(items, config) }
    }

    if (path === '/api/v1/home') {
      return { status: 200, data: { ...mockHomeFeed, generatedAt: new Date().toISOString() } }
    }

    const channelStores = path.match(/^\/api\/v1\/channels\/([^/]+)\/source-stores$/)
    if (channelStores) {
      const channelId = decodeURIComponent(channelStores[1])
      const stores = mockSourceStores.filter((store) => store.channelId === channelId)
      return { status: 200, data: { stores } }
    }

    if (path.startsWith('/api/v1/source-stores/') && path.endsWith('/menu')) {
      return {
        status: 200,
        data: {
          store: { id: 'ss_store', channelId: 'ch_store', name: 'Demo store direct' },
          menu: { id: 'menu_store_pickup', fulfillmentMode: 'pickup', deliveryExecutor: '' },
          categories: [
            {
              category: { id: 'cat_store', name: 'Mains' },
              items: [
                {
                  id: 'si_store_burger',
                  name: 'Classic Burger',
                  price: { amountCents: 1200, currency: 'CAD' },
                },
              ],
            },
          ],
        },
      }
    }
  }

  if (method === 'post' && path === '/api/v1/sponsored/events') {
    return {
      status: 202,
      data: { id: `spe_mock_${Date.now().toString(16)}`, occurred_at: new Date().toISOString() },
    }
  }

  const addressMatch = path.match(addressRoute)
  if (addressMatch) {
    const addressId = decodeURIComponent(addressMatch[1])
    if (method === 'delete') {
      const index = mockAccount.addresses.findIndex((entry) => entry.id === addressId)
      if (index === -1) return { status: 404, data: { error: 'saved address not found' } }
      const removed = mockAccount.addresses[index]
      mockAccount.addresses.splice(index, 1)
      if (removed.current && mockAccount.addresses[0]) {
        mockAccount.addresses.forEach((entry, i) => {
          entry.current = i === 0
        })
      }
      return { status: 204, data: null }
    }
    if (method === 'put' && path.endsWith('/current')) {
      const target = mockAccount.addresses.find((entry) => entry.id === addressId)
      if (!target) return { status: 404, data: { error: 'saved address not found' } }
      mockAccount.addresses.forEach((entry) => {
        entry.current = entry.id === addressId
      })
      return { status: 204, data: null }
    }
  }

  if (path.startsWith('/api/v1/source-stores/') && path.endsWith('/menu')) {
    return {
      status: 200,
      data: {
        store: { id: 'ss_store', channelId: 'ch_store', name: 'Demo store direct' },
        menu: { id: 'menu_store_pickup', fulfillmentMode: 'pickup', deliveryExecutor: '' },
        categories: [
          {
            category: { id: 'cat_store', name: 'Mains' },
            items: [
              {
                id: 'si_store_burger',
                name: 'Classic Burger',
                price: { amountCents: 1200, currency: 'CAD' },
              },
            ],
          },
        ],
      },
    }
  }

  return null
}

export function isMockableRequest(config: InternalAxiosRequestConfig): boolean {
  return resolveMock(config) !== null
}
