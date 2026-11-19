import { formatDate } from '@/core/services/dates'
import { sortByName } from '@/core/services/sort'

describe('sortByName', () => {
  const named = (fr: string, en: string) => ({ name: { fr, en } })
  const records = [
    named('Zoo', 'Zoo'),
    named('école', 'School'),
    named('Église', 'Church'),
    named('Atelier 10', 'Workshop 10'),
    named('Atelier 9', 'Workshop 9'),
  ]

  it('sorts by the French name with French collation', () => {
    expect(sortByName(records, 'fr').map((r) => r.name.fr)).toEqual([
      'Atelier 9',
      'Atelier 10',
      'école',
      'Église',
      'Zoo',
    ])
  })

  it('sorts by the English name in English', () => {
    expect(sortByName(records, 'en').map((r) => r.name.en)).toEqual([
      'Church',
      'School',
      'Workshop 9',
      'Workshop 10',
      'Zoo',
    ])
  })

  it('does not change the input', () => {
    const copy = [...records]
    sortByName(records, 'fr')
    expect(records).toEqual(copy)
  })
})

describe('formatDate', () => {
  it('formats a calendar date per locale', () => {
    expect(formatDate('2026-11-19', 'fr')).toBe('19 novembre 2026')
    expect(formatDate('2026-11-19', 'en')).toBe('November 19, 2026')
  })

  it('never shifts the day, whatever the time zone', () => {
    expect(formatDate('2027-01-01', 'en')).toBe('January 1, 2027')
    expect(formatDate('2026-12-31', 'fr')).toBe('31 décembre 2026')
  })
})
