import { LOCALES, type Language } from '@/core/i18n/language'

/** Events are dated in Saint-Jean-sur-Richelieu's time zone (specs/tech-stack.md). */
export const EVENT_TIME_ZONE = 'America/Montreal'

const MS_PER_DAY = 86_400_000

/**
 * Formats a calendar date (`YYYY-MM-DD`, e.g. `lastVerified`) for display:
 * "19 novembre 2026" / "November 19, 2026". Read as UTC midnight and formatted
 * in UTC, so the day never shifts with the device's time zone.
 */
export function formatDate(isoDate: string, language: Language): string {
  return new Intl.DateTimeFormat(LOCALES[language], {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

/** Parts of `instant` on the wall clock of `timeZone`. */
function wallClock(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}

/** The calendar date (`YYYY-MM-DD`) of `instant` in `timeZone`. */
export function calendarDateIn(instant: Date, timeZone: string = EVENT_TIME_ZONE): string {
  return wallClock(instant, timeZone).date
}

/** Whole days from calendar date `from` to calendar date `to` (negative if `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY)
}

/**
 * An all-day event starts at midnight and ends at 23:59 or midnight, Montreal time.
 * Its dates are shown without times.
 */
export function isAllDay(start: Date, end: Date): boolean {
  const startTime = wallClock(start, EVENT_TIME_ZONE).time
  const endTime = wallClock(end, EVENT_TIME_ZONE).time
  return startTime === '00:00' && (endTime === '23:59' || endTime === '00:00')
}

/**
 * Formats an event's dates in Montreal time, per locale, collapsing what the
 * two ends share: "sam. 5 décembre 2026, 19 h 30 – 22 h 00" /
 * "Sat, August 14–Sun, August 22, 2027" (all-day events show no times).
 */
export function formatDateRange(start: Date, end: Date, language: Language): string {
  const format = new Intl.DateTimeFormat(LOCALES[language], {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: EVENT_TIME_ZONE,
    ...(isAllDay(start, end) ? {} : { hour: 'numeric', minute: '2-digit' }),
  })
  return format.formatRange(start, end)
}
