import type { EventRecord } from '@/core/modules/events/schema'
import { calendarDateIn, daysBetween, EVENT_TIME_ZONE } from '@/core/services/dates'

/** An event is Recent for this many days after the day it ends. */
export const RECENT_WINDOW_DAYS = 30

/**
 * - `upcoming`: ends today or later (Montreal calendar dates, so an event ending
 *   tonight stays Upcoming all day, specs/2026-11-19-events D2);
 * - `recent`: ended 1 to 30 days ago;
 * - `past`: ended longer ago (neither listed nor drawn).
 */
export type EventStatus = 'upcoming' | 'recent' | 'past'

export function eventStatus(event: EventRecord, now: Date): EventStatus {
  const endDay = calendarDateIn(new Date(event.endDate), EVENT_TIME_ZONE)
  const today = calendarDateIn(now, EVENT_TIME_ZONE)
  const daysSinceEnd = daysBetween(endDay, today)
  if (daysSinceEnd <= 0) return 'upcoming'
  if (daysSinceEnd <= RECENT_WINDOW_DAYS) return 'recent'
  return 'past'
}

const byStart = (a: EventRecord, b: EventRecord) =>
  Date.parse(a.startDate) - Date.parse(b.startDate)
const byEndDescending = (a: EventRecord, b: EventRecord) =>
  Date.parse(b.endDate) - Date.parse(a.endDate)

/** Upcoming (and ongoing) events, soonest start first. */
export function selectUpcoming(events: readonly EventRecord[], now: Date): EventRecord[] {
  return events.filter((event) => eventStatus(event, now) === 'upcoming').sort(byStart)
}

/** Events that ended in the last 30 days, most recently ended first. */
export function selectRecent(events: readonly EventRecord[], now: Date): EventRecord[] {
  return events.filter((event) => eventStatus(event, now) === 'recent').sort(byEndDescending)
}

/** Upcoming and recent events, in their original order (what the map draws). */
export function selectCurrent(events: readonly EventRecord[], now: Date): EventRecord[] {
  return events.filter((event) => eventStatus(event, now) !== 'past')
}
