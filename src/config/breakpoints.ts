// ─────────────────────────────────────────────────────────────────────────────
// VIEWPORT TIERS — single source of truth
//
// The actual breakpoint NUMBERS live in ONE place: the `@theme` block in
// src/styles/globals.css (`--breakpoint-small`, `--breakpoint-large`).
//
//   - Tailwind reads them at BUILD time to generate the `max-small:` / `large:`
//     responsive variants used in markup.
//   - This module reads the SAME values at RUNTIME via getComputedStyle, so the
//     JS tier logic (useViewport) can never drift from the CSS variants.
//
// => Change one number in globals.css and the whole app recalibrates.
//
// The *_FALLBACK constants below are only used before the stylesheet is applied
// (they should mirror the CSS, but the CSS always wins once loaded).
// ─────────────────────────────────────────────────────────────────────────────

export type Tier = 'small' | 'medium' | 'large'

/** Mirror of --breakpoint-small in globals.css. Width < this => 'small' (phones). */
const SMALL_MAX_FALLBACK = 820
/** Mirror of --breakpoint-large in globals.css. Width >= this => 'large' (TV/wide). */
const LARGE_MIN_FALLBACK = 1920

function readCssPx(name: string, fallback: number): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

/** Live small-tier ceiling (px), read from the CSS single source of truth. */
const getSmallMax = (): number => readCssPx('--breakpoint-small', SMALL_MAX_FALLBACK)
/** Live large-tier floor (px), read from the CSS single source of truth. */
const getLargeMin = (): number => readCssPx('--breakpoint-large', LARGE_MIN_FALLBACK)

// -0.02px avoids the 1px overlap between `max-width` (small) and `min-width` (medium).
export const smallQuery = (): string => `(max-width: ${getSmallMax() - 0.02}px)`
export const largeQuery = (): string => `(min-width: ${getLargeMin()}px)`
