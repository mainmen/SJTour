import { eventsModule } from '@/core/modules/events/module'
import { eventSchema, type EventRecord } from '@/core/modules/events/schema'
import {
  eventStatus,
  selectCurrent,
  selectRecent,
  selectUpcoming,
} from '@/core/modules/events/selectors'
import { shippedRecords } from '@/core/test/records'

function event(id: string, startDate: string, endDate: string): EventRecord {
  return {
    id,
    category: 'events',
    name: { fr: id, en: id },
    description: { fr: 'Événement.', en: 'Event.' },
    coordinates: [45.3062, -73.254],
    lastVerified: '2026-11-19',
    startDate,
    endDate,
  }
}

/** 2026-11-19 at noon in Montreal (EST, UTC−5). */
const NOW = new Date('2026-11-19T12:00:00-05:00')

describe('eventSchema', () => {
  const valid = event('fete', '2026-12-05T19:30:00-05:00', '2026-12-05T22:00:00-05:00')

  it('accepts dates with an offset (or Z)', () => {
    expect(eventSchema.safeParse(valid).success).toBe(true)
    expect(
      eventSchema.safeParse({
        ...valid,
        startDate: '2026-12-06T00:30:00Z',
        endDate: '2026-12-06T03:00:00Z',
      }).success,
    ).toBe(true)
  })

  it.each([
    ['a date-time without an offset', { startDate: '2026-12-05T19:30:00' }, 'startDate'],
    ['a date only', { endDate: '2026-12-05' }, 'endDate'],
    ['a missing start date', { startDate: undefined }, 'startDate'],
    ['an end before the start', { endDate: '2026-12-05T19:00:00-05:00' }, 'endDate'],
  ])('rejects %s', (_label, patch, path) => {
    const result = eventSchema.safeParse({ ...valid, ...patch })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain(path)
  })

  it('accepts an event that starts and ends at the same instant', () => {
    const instant = '2026-12-05T19:30:00-05:00'
    expect(eventSchema.safeParse({ ...valid, startDate: instant, endDate: instant }).success).toBe(
      true,
    )
  })
})

describe('eventStatus', () => {
  it.each([
    ['ends later today', '2026-11-19T08:00:00-05:00', '2026-11-19T23:00:00-05:00', 'upcoming'],
    ['ended earlier today', '2026-11-19T08:00:00-05:00', '2026-11-19T09:00:00-05:00', 'upcoming'],
    ['is ongoing', '2026-11-01T08:00:00-04:00', '2026-12-01T17:00:00-05:00', 'upcoming'],
    ['starts in the future', '2027-08-14T00:00:00-04:00', '2027-08-22T23:59:00-04:00', 'upcoming'],
    ['ended yesterday', '2026-11-18T08:00:00-05:00', '2026-11-18T22:00:00-05:00', 'recent'],
    ['ended 30 days ago', '2026-10-20T08:00:00-04:00', '2026-10-20T20:00:00-04:00', 'recent'],
    ['ended 31 days ago', '2026-10-19T08:00:00-04:00', '2026-10-19T20:00:00-04:00', 'past'],
  ])('an event that %s is %s', (_label, start, end, status) => {
    expect(eventStatus(event('e', start, end), NOW)).toBe(status)
  })

  it('uses the Montreal date, not UTC: 23:30 tonight is already tomorrow in UTC', () => {
    // Ended yesterday at 23:30 Montreal = 04:30 UTC today: still Recent, not Upcoming.
    const late = event('late', '2026-11-18T20:00:00-05:00', '2026-11-19T04:30:00Z')
    expect(eventStatus(late, NOW)).toBe('recent')
    // At 23:30 Montreal tonight (04:30 UTC tomorrow), an event ending today is still Upcoming.
    const tonight = new Date('2026-11-20T04:30:00Z')
    const endsToday = event('today', '2026-11-19T08:00:00-05:00', '2026-11-19T10:00:00-05:00')
    expect(eventStatus(endsToday, tonight)).toBe('upcoming')
  })

  it('counts calendar days across the DST change (1 November 2026)', () => {
    // Ended 31 October (EDT); 30 November (EST) is 30 calendar days later.
    const halloween = event('h', '2026-10-31T18:00:00-04:00', '2026-10-31T23:00:00-04:00')
    expect(eventStatus(halloween, new Date('2026-11-30T23:59:00-05:00'))).toBe('recent')
    expect(eventStatus(halloween, new Date('2026-12-01T00:01:00-05:00'))).toBe('past')
  })
})

describe('event lists', () => {
  const christmas = event('christmas', '2026-11-28T10:00:00-05:00', '2026-12-20T17:00:00-05:00')
  const concert = event('concert', '2026-12-05T19:30:00-05:00', '2026-12-05T22:00:00-05:00')
  const ongoing = event('ongoing', '2026-11-01T10:00:00-04:00', '2026-11-30T17:00:00-05:00')
  const fall = event('fall', '2026-11-07T09:00:00-05:00', '2026-11-08T16:00:00-05:00')
  const run = event('run', '2026-10-25T08:00:00-04:00', '2026-10-25T12:00:00-04:00')
  const old = event('old', '2026-09-12T13:00:00-04:00', '2026-09-12T18:00:00-04:00')
  const all = [concert, old, run, christmas, fall, ongoing]

  it('Upcoming is sorted by start, soonest first', () => {
    expect(selectUpcoming(all, NOW).map((e) => e.id)).toEqual(['ongoing', 'christmas', 'concert'])
  })

  it('Recent is sorted by end, most recently ended first', () => {
    expect(selectRecent(all, NOW).map((e) => e.id)).toEqual(['fall', 'run'])
  })

  it('the map draws upcoming and recent events, not past ones', () => {
    expect(selectCurrent(all, NOW).map((e) => e.id)).toEqual([
      'concert',
      'run',
      'christmas',
      'fall',
      'ongoing',
    ])
    expect(eventsModule.visibleOnMap?.(all, NOW)).not.toContainEqual(old)
  })

  it('does not change the input', () => {
    const copy = [...all]
    selectUpcoming(all, NOW)
    selectRecent(all, NOW)
    expect(all).toEqual(copy)
  })
})

describe('shipped events', () => {
  const records = shippedRecords(eventsModule)
  const SEEDED_ON = new Date('2026-11-19T12:00:00-05:00')

  it('have upcoming, recent and past events as of the seed date', () => {
    expect(selectUpcoming(records, SEEDED_ON).length).toBeGreaterThanOrEqual(3)
    expect(selectRecent(records, SEEDED_ON).length).toBeGreaterThanOrEqual(2)
    expect(records.some((r) => eventStatus(r, SEEDED_ON) === 'past')).toBe(true)
  })

  it('include the balloon festival in August', () => {
    const festival = records.find((r) => r.id === 'international-de-montgolfieres')
    expect(festival?.startDate).toMatch(/^\d{4}-08-/)
  })

  it('are all flagged as sample data (until Phase 13)', () => {
    expect(records.every((r) => r.sample === true)).toBe(true)
  })
})
