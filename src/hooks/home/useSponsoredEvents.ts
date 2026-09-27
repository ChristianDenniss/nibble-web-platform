/**
 * Sponsored impression / click reporting (POST /v1/sponsored/events).
 * Impressions count once per placement per browser session; clicks count every time.
 * Fire-and-forget: a failed report must never block navigation.
 */
import { useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import type { SponsoredMark } from '@/generated/data-model'

const SEEN_KEY = 'nibble.sponsoredSeen'

type EventKind = 'impression' | 'click'

function seenPlacements(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

function report(placementId: string, kind: EventKind, surface: string) {
  axios
    .post('/api/v1/sponsored/events', { placement_id: placementId, kind, surface })
    .catch(() => undefined)
}

export function trackSponsoredImpression(placementId: string, surface: string) {
  const seen = seenPlacements()
  if (seen.has(placementId)) return
  seen.add(placementId)
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]))
  } catch {
    /* storage full or blocked; still report */
  }
  report(placementId, 'impression', surface)
}

export function trackSponsoredClick(placementId: string, surface: string) {
  report(placementId, 'click', surface)
}

/**
 * Attach the returned ref to a sponsored tile. Reports an impression once at least
 * half of it is on screen, and exposes onClick for the tile's link.
 * Pass null for organic tiles and nothing is reported.
 */
export function useSponsoredTracking<T extends HTMLElement>(mark: SponsoredMark | null, surface: string) {
  const ref = useRef<T | null>(null)
  const placementId = mark?.placementId ?? null

  useEffect(() => {
    const node = ref.current
    if (!placementId || !node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackSponsoredImpression(placementId, surface)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [placementId, surface])

  const onClick = useCallback(() => {
    if (placementId) trackSponsoredClick(placementId, surface)
  }, [placementId, surface])

  return { ref, onClick }
}
