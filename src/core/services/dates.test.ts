import { calendarDateIn, daysBetween, formatDateRange, isAllDay } from '@/core/services/dates'

/** Intl uses no-break and thin spaces; compare with plain spaces. */
const plain = (text: string) => text.replace(/\s/g, ' ')

describe('calendarDateIn', () => {
  it('gives the Montreal date of an instant', () => {
    expect(calendarDateIn(new Date('2026-11-19T12:00:00-05:00'))).toBe('2026-11-19')
  })

  it('handles a late evening that is already tomorrow in UTC', () => {
    const lateEvening = new Date('2026-11-20T04:30:00Z') // 23:30 on the 19th in Montreal
    expect(calendarDateIn(lateEvening)).toBe('2026-11-19')
    expect(calendarDateIn(lateEvening, 'UTC')).toBe('2026-11-20')
  })

  it('handles summer time (EDT, UTC−4)', () => {
    expect(calendarDateIn(new Date('2027-08-15T03:59:00Z'))).toBe('2027-08-14')
    expect(calendarDateIn(new Date('2027-08-15T04:00:00Z'))).toBe('2027-08-15')
  })
})

describe('daysBetween', () => {
  it('counts calendar days, signed', () => {
    expect(daysBetween('2026-11-19', '2026-11-19')).toBe(0)
    expect(daysBetween('2026-11-18', '2026-11-19')).toBe(1)
    expect(daysBetween('2026-11-19', '2026-11-18')).toBe(-1)
    expect(daysBetween('2026-10-20', '2026-11-19')).toBe(30)
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1)
  })
})

describe('isAllDay', () => {
  it('is true from midnight to 23:59 or midnight, Montreal time', () => {
    expect(
      isAllDay(new Date('2027-08-14T00:00:00-04:00'), new Date('2027-08-22T23:59:00-04:00')),
    ).toBe(true)
    expect(
      isAllDay(new Date('2027-08-14T00:00:00-04:00'), new Date('2027-08-15T00:00:00-04:00')),
    ).toBe(true)
  })

  it('is false for timed events, and for UTC midnight', () => {
    expect(
      isAllDay(new Date('2026-12-05T19:30:00-05:00'), new Date('2026-12-05T22:00:00-05:00')),
    ).toBe(false)
    expect(isAllDay(new Date('2026-12-05T00:00:00Z'), new Date('2026-12-05T23:59:00Z'))).toBe(false)
  })
})

describe('formatDateRange', () => {
  const concert = [new Date('2026-12-05T19:30:00-05:00'), new Date('2026-12-05T22:00:00-05:00')]
  const market = [new Date('2026-11-28T10:00:00-05:00'), new Date('2026-12-20T17:00:00-05:00')]
  const festival = [new Date('2027-08-14T00:00:00-04:00'), new Date('2027-08-22T23:59:00-04:00')]

  it('collapses a same-day event to one date and a time range', () => {
    expect(plain(formatDateRange(concert[0], concert[1], 'fr'))).toBe(
      'sam. 5 décembre 2026, 19 h 30 – 22 h 00',
    )
    expect(plain(formatDateRange(concert[0], concert[1], 'en'))).toBe(
      'Sat, December 5, 2026, 7:30–10:00 p.m.',
    )
  })

  it('shows both dates and times for a multi-day event', () => {
    expect(plain(formatDateRange(market[0], market[1], 'fr'))).toBe(
      'sam. 28 novembre 2026 à 10 h 00 – dim. 20 décembre 2026 à 17 h 00',
    )
    expect(plain(formatDateRange(market[0], market[1], 'en'))).toBe(
      'Sat, November 28, 2026 at 10:00 a.m.–Sun, December 20, 2026 at 5:00 p.m.',
    )
  })

  it('shows dates only for an all-day event', () => {
    expect(plain(formatDateRange(festival[0], festival[1], 'fr'))).toBe(
      'sam. 14 août – dim. 22 août 2027',
    )
    expect(plain(formatDateRange(festival[0], festival[1], 'en'))).toBe(
      'Sat, August 14–Sun, August 22, 2027',
    )
  })

  it('formats in Montreal time whatever the instant’s offset', () => {
    const utc = [new Date('2026-12-06T00:30:00Z'), new Date('2026-12-06T03:00:00Z')]
    expect(plain(formatDateRange(utc[0], utc[1], 'en'))).toBe(
      'Sat, December 5, 2026, 7:30–10:00 p.m.',
    )
  })
})
