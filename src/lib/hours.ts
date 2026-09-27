/**
 * Weekly restaurant hours helpers. Intervals are local "HH:MM" strings; a closing time at or before
 * the opening time runs past midnight into the next day.
 */
import type { RestaurantHours } from '@/generated/data-model'

export type HoursService = RestaurantHours['service']

export interface DaySchedule {
  dayOfWeek: number
  label: string
  intervals: { opens: string; closes: string }[]
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
/** Display order: Monday first, Sunday last. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const overnight = (interval: { opens: string; closes: string }) => toMinutes(interval.closes) <= toMinutes(interval.opens)

/** "21:30" -> "9:30 PM", "00:00" -> "12:00 AM". */
export function formatTime(hhmm: string): string {
  const minutes = toMinutes(hhmm)
  const h = Math.floor(minutes / 60)
  const suffix = h < 12 ? 'AM' : 'PM'
  return `${h % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${suffix}`
}

export function weeklySchedule(hours: RestaurantHours[], service: HoursService): DaySchedule[] {
  return WEEK_ORDER.map((dayOfWeek) => ({
    dayOfWeek,
    label: DAY_NAMES[dayOfWeek],
    intervals: hours
      .filter((entry) => entry.service === service && entry.dayOfWeek === dayOfWeek)
      .sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens))
      .map(({ opens, closes }) => ({ opens, closes })),
  }))
}

export function hasHours(hours: RestaurantHours[], service: HoursService): boolean {
  return hours.some((entry) => entry.service === service)
}

/** The interval covering `at`, including one that opened yesterday and runs past midnight. */
export function currentInterval(hours: RestaurantHours[], service: HoursService, at: Date): RestaurantHours | undefined {
  const day = at.getDay()
  const yesterday = (day + 6) % 7
  const now = at.getHours() * 60 + at.getMinutes()
  return hours.find((entry) => {
    if (entry.service !== service) return false
    const opens = toMinutes(entry.opens)
    const closes = toMinutes(entry.closes)
    if (entry.dayOfWeek === day) return now >= opens && (overnight(entry) || now < closes)
    return entry.dayOfWeek === yesterday && overnight(entry) && now < closes
  })
}
