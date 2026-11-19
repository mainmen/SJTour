import { activitiesModule } from '@/core/modules/activities/module'
import { activitySchema, SUBCATEGORIES, type Activity } from '@/core/modules/activities/schema'
import { bySubcategory, groupBySubcategory } from '@/core/modules/activities/selectors'
import { shippedRecords } from '@/core/test/records'

function activity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'parc',
    category: 'activities',
    name: { fr: 'Parc', en: 'Park' },
    description: { fr: 'Un parc.', en: 'A park.' },
    coordinates: [45.3112, -73.2511],
    lastVerified: '2026-11-19',
    subcategory: 'parks',
    ...overrides,
  }
}

describe('activitySchema', () => {
  it.each(SUBCATEGORIES)('accepts the %s subcategory', (subcategory) => {
    expect(activitySchema.safeParse(activity({ subcategory })).success).toBe(true)
  })

  it.each([
    ['an unknown subcategory', { subcategory: 'shopping' }, 'subcategory'],
    ['a missing subcategory', { subcategory: undefined }, 'subcategory'],
    ['a company field', { sector: 'food' }, ''],
    ['another category', { category: 'companies' }, 'category'],
  ])('rejects %s', (_label, patch, path) => {
    const result = activitySchema.safeParse({ ...activity(), ...patch })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain(path)
  })
})

describe('activity selectors', () => {
  const park = activity()
  const museum = activity({ id: 'musee', subcategory: 'culture' })
  const theatre = activity({ id: 'theatre', subcategory: 'culture' })

  it('bySubcategory keeps one subcategory', () => {
    expect(bySubcategory([park, museum, theatre], 'culture')).toEqual([museum, theatre])
    expect(bySubcategory([park], 'dining')).toEqual([])
  })

  it('groupBySubcategory has every subcategory, in display order', () => {
    const groups = groupBySubcategory([museum, park, theatre])
    expect(Object.keys(groups)).toEqual(['parks', 'culture', 'dining', 'outdoor'])
    expect(groups).toEqual({ parks: [park], culture: [museum, theatre], dining: [], outdoor: [] })
  })
})

describe('shipped activities', () => {
  const records = shippedRecords(activitiesModule)

  it('cover every subcategory', () => {
    const groups = groupBySubcategory(records)
    for (const subcategory of SUBCATEGORIES) expect(groups[subcategory].length).toBeGreaterThan(0)
  })

  it('include the Musée du Haut-Richelieu as culture', () => {
    expect(records.find((r) => r.id === 'musee-du-haut-richelieu')?.subcategory).toBe('culture')
  })

  it('are all flagged as sample data (until Phase 13)', () => {
    expect(records.every((r) => r.sample === true)).toBe(true)
  })
})
