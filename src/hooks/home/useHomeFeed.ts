/**
 * useHomeFeed — loads GET /v1/home (banners + rails of restaurant ids).
 * The feed only carries ids; pages join them against useStorefront() data.
 */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { extractAxiosError } from '@/errors'
import type { HomeFeed, HomeFeedItem, Restaurant } from '@/generated/data-model'

export interface HomeFeedState {
  loading: boolean
  feed: HomeFeed | null
  error: string | null
}

let homeFeedRequest: Promise<{ data: HomeFeed }> | null = null

function getHomeFeedRequest() {
  homeFeedRequest ??= axios.get<HomeFeed>('/api/v1/home')
  return homeFeedRequest
}

export function preloadHomeFeed(): void {
  void getHomeFeedRequest()
}

export function useHomeFeed(): HomeFeedState {
  const [state, setState] = useState<HomeFeedState>({ loading: true, feed: null, error: null })

  useEffect(() => {
    let cancelled = false
    getHomeFeedRequest()
      .then((response) => {
        if (!cancelled) setState({ loading: false, feed: response.data, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ loading: false, feed: null, error: extractAxiosError(err, 'home feed failed to load') })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export interface ResolvedFeedItem {
  item: HomeFeedItem
  restaurant: Restaurant
}

/** Drops feed items whose restaurant isn't in the loaded catalog. */
export function resolveFeedItems(items: HomeFeedItem[], restaurants: Restaurant[]): ResolvedFeedItem[] {
  const byId = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]))
  return items.flatMap((item) => {
    const restaurant = byId.get(item.restaurantId)
    return restaurant ? [{ item, restaurant }] : []
  })
}
