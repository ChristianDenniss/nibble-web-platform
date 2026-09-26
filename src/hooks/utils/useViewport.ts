import { useSyncExternalStore } from 'react'
import { smallQuery, largeQuery, type Tier } from '@/config/breakpoints'

// matchMedia-based viewport tier detection. Mirrors the media queries Tailwind
// generates from --breakpoint-small / --breakpoint-large (see globals.css), so
// the `isSmall`/`isLarge` runtime branches always agree with the `max-small:` /
// `large:` CSS variants.
//
// The two MediaQueryList objects are created once, lazily, in the browser.

let smallMql: MediaQueryList | null = null
let largeMql: MediaQueryList | null = null

function ensureMqls() {
  if (!smallMql) smallMql = window.matchMedia(smallQuery())
  if (!largeMql) largeMql = window.matchMedia(largeQuery())
  return { small: smallMql, large: largeMql }
}

function subscribe(onChange: () => void): () => void {
  const { small, large } = ensureMqls()
  small.addEventListener('change', onChange)
  large.addEventListener('change', onChange)
  return () => {
    small.removeEventListener('change', onChange)
    large.removeEventListener('change', onChange)
  }
}

function getSnapshot(): Tier {
  if (typeof window === 'undefined') return 'medium'
  const { small, large } = ensureMqls()
  if (small.matches) return 'small'
  if (large.matches) return 'large'
  return 'medium'
}

// medium is the safe, unchanged layout — any pre-hydration flash resolves toward
// it, never toward an unfinished phone/TV layout.
const getServerSnapshot = (): Tier => 'medium'

export interface Viewport {
  tier: Tier
  isSmall: boolean
  isMedium: boolean
  isLarge: boolean
}

export function useViewport(): Viewport {
  const tier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return {
    tier,
    isSmall: tier === 'small',
    isMedium: tier === 'medium',
    isLarge: tier === 'large',
  }
}
