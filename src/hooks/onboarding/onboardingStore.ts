/**
 * onboardingStore — splash + first-run state.
 * Splash (/welcome) shows once per browser session (refreshes don't bring it back);
 * the location picker on it only until this browser has onboarded.
 */
const STORAGE_KEY = 'nibble.onboarded'
const SPLASH_KEY = 'nibble.splashSeen'

let splashSeen = false

export function hasSeenSplash(): boolean {
  if (splashSeen) return true
  try {
    splashSeen = sessionStorage.getItem(SPLASH_KEY) === '1'
  } catch {
    /* storage blocked — fall back to once per app load */
  }
  return splashSeen
}

export function markSplashSeen() {
  splashSeen = true
  try {
    sessionStorage.setItem(SPLASH_KEY, '1')
  } catch {
    /* storage blocked — the in-memory flag still covers this app load */
  }
}

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* private mode — skip persisting, the user can still browse */
  }
}
