/**
 * URL matchers for the DEV mock adapter.
 * Keep this the only place that knows which /api paths the catalog can answer.
 */
import type { InternalAxiosRequestConfig } from 'axios'
import { mockCatalog } from './catalog'

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

export function resolveMock(config: InternalAxiosRequestConfig): MockResult | null {
  const path = pathOf(config)
  const method = (config.method ?? 'get').toLowerCase()
  if (method !== 'get') return null

  if (path === '/api/v1/storefront' || path === '/api/storefront' || path === '/storefront' || path === '/v1/storefront') {
    return { status: 200, data: mockCatalog }
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
