/**
 * comparePrefsStore — the user's default compare filters and declared memberships.
 * Kept in localStorage until api-engine exposes a settings write (user service SaveSettings);
 * the shape mirrors ComparePrefs so it can move server-side unchanged.
 */
import { useSyncExternalStore } from 'react'
import type { ComparePrefs } from '@/generated/data-model'
import { DIRECT_CHANNELS, FULFILLMENT_OPTIONS } from '@/lib/comparePrefOptions'

const STORAGE_KEY = 'nibble.comparePrefs'

export interface DefaultPreferences {
  prefs: ComparePrefs
  memberships: string[]
}

export const DEFAULT_PREFERENCES: DefaultPreferences = {
  prefs: {
    allowedFulfillmentModes: FULFILLMENT_OPTIONS.map((option) => option.mode),
    willingToUseAggregator: true,
    allowedChannelIds: [],
    blockedChannelIds: [],
    driveThruOK: true,
    merchantDirectOK: true,
  },
  memberships: [],
}

let state: DefaultPreferences = typeof window !== 'undefined' ? readStorage() : DEFAULT_PREFERENCES
const listeners = new Set<() => void>()

function readStorage(): DefaultPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<DefaultPreferences>
    return {
      prefs: { ...DEFAULT_PREFERENCES.prefs, ...parsed.prefs },
      memberships: Array.isArray(parsed.memberships) ? parsed.memberships : [],
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function saveDefaultPreferences(next: DefaultPreferences) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* quota / private mode — keep in memory for this visit */
  }
  listeners.forEach((listener) => listener())
}

export function getDefaultPreferences(): DefaultPreferences {
  return state
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function useDefaultPreferences(): DefaultPreferences {
  return useSyncExternalStore(subscribe, getDefaultPreferences, () => DEFAULT_PREFERENCES)
}

/** Compare filters in the api-engine wire shape. Direct channels are blocked when ordering direct is off. */
export function compareFiltersWire({ prefs }: DefaultPreferences) {
  const blocked = new Set(prefs.blockedChannelIds)
  if (!prefs.merchantDirectOK) DIRECT_CHANNELS.forEach((channel) => blocked.add(channel.channelId))
  return {
    allowed_fulfillment_modes: prefs.allowedFulfillmentModes,
    willing_to_use_aggregator: prefs.willingToUseAggregator,
    allowed_channel_ids: prefs.allowedChannelIds,
    blocked_channel_ids: [...blocked],
    drive_thru_ok: prefs.allowedFulfillmentModes.includes('drive_thru'),
    merchant_direct_ok: prefs.merchantDirectOK,
  }
}
