// ─────────────────────────────────────────────────────────────────────────────
// SHELL DIMENSIONS — single place for the hardcoded app-shell pixel literals.
//
// These class fragments were previously duplicated across AppLayout, Header and
// Sidebar. They are exported as literal strings (Tailwind scans .ts files, so it
// still sees `w-[56px]` etc.) — importing them produces byte-identical output.
//
// Only the `medium` (default) shell uses these. The `small` (phone) shell hides
// the sidebar entirely and runs the main content full-width (see AppLayout).
// ─────────────────────────────────────────────────────────────────────────────

/** Header height (56px) and the matching top offset for content below it. */
export const HEADER_TOP = 'top-14'

/** Main-content left offset that tracks the sidebar width on medium/large. */
export const MAIN_LEFT_COLLAPSED = 'left-[56px]'
export const MAIN_LEFT_EXPANDED = 'left-[195px]'
