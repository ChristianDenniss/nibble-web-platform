/**
 * URL matchers for the DEV mock adapter.
 * Keep this the only place that knows which /api paths the catalog can answer.
 */
import type { InternalAxiosRequestConfig } from 'axios'
import { mockAccount, mockCatalog } from './catalog'

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

  if (method === 'get') {
    if (path === '/api/v1/storefront' || path === '/api/storefront' || path === '/storefront' || path === '/v1/storefront') {
      return { status: 200, data: mockCatalog }
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
