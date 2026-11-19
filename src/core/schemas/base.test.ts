import { z } from 'zod'
import { baseRecordSchema, defineRecordSchema } from '@/core/schemas/base'
import { pickText } from '@/core/types/bilingual'

const valid = {
  id: 'cafe-du-quai',
  category: 'companies',
  name: { fr: 'Café du quai', en: 'Quay Café' },
  description: { fr: 'Un café.', en: 'A café.' },
  coordinates: [45.3073, -73.2625],
  lastVerified: '2026-11-19',
  sample: true,
  address: '1 rue Richelieu, Saint-Jean-sur-Richelieu',
  website: 'https://example.com/',
}

/** Paths of the issues raised for `record`. */
function issuePaths(record: unknown, schema: z.ZodType = baseRecordSchema): string[] {
  const result = schema.safeParse(record)
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'))
}

describe('pickText', () => {
  it('picks the text in the requested language', () => {
    expect(pickText(valid.name, 'fr')).toBe('Café du quai')
    expect(pickText(valid.name, 'en')).toBe('Quay Café')
  })
})

describe('baseRecordSchema', () => {
  it('accepts a complete valid record', () => {
    expect(baseRecordSchema.parse(valid)).toEqual(valid)
  })

  it('accepts a record without the optional fields', () => {
    const minimal: Record<string, unknown> = { ...valid }
    for (const key of ['sample', 'address', 'website']) delete minimal[key]
    expect(baseRecordSchema.safeParse(minimal).success).toBe(true)
  })

  it.each([
    ['an upper-case id', { id: 'Cafe' }, 'id'],
    ['an id with spaces', { id: 'cafe du quai' }, 'id'],
    ['an id with a trailing dash', { id: 'cafe-' }, 'id'],
    ['an unknown category', { category: 'shops' }, 'category'],
    ['an empty French name', { name: { fr: '', en: 'Quay Café' } }, 'name.fr'],
    ['a blank English name', { name: { fr: 'Café', en: '   ' } }, 'name.en'],
    ['a missing language', { description: { fr: 'Un café.' } }, 'description.en'],
    ['an extra language', { name: { fr: 'a', en: 'b', es: 'c' } }, 'name'],
    ['coordinates outside the city', { coordinates: [45.5017, -73.5673] }, 'coordinates'],
    ['swapped coordinates', { coordinates: [-73.2625, 45.3073] }, 'coordinates'],
    ['a single coordinate', { coordinates: [45.3073] }, 'coordinates'],
    ['an impossible date', { lastVerified: '2026-02-30' }, 'lastVerified'],
    ['a date-time instead of a date', { lastVerified: '2026-11-19T10:00:00Z' }, 'lastVerified'],
    ['a non-https website', { website: 'http://example.com/' }, 'website'],
    ['a non-boolean sample flag', { sample: 'yes' }, 'sample'],
    ['an unknown key', { phone: '450-555-0100' }, ''],
  ])('rejects %s', (_label, patch, path) => {
    expect(issuePaths({ ...valid, ...patch })).toContain(path)
  })
})

describe('defineRecordSchema', () => {
  const schema = defineRecordSchema('companies', { floors: z.number().int() })

  it('adds the category fields and fixes the category', () => {
    expect(schema.safeParse({ ...valid, floors: 2 }).success).toBe(true)
    expect(issuePaths({ ...valid, floors: 2, category: 'events' }, schema)).toEqual(['category'])
  })

  it('still rejects unknown keys and missing extra fields', () => {
    expect(issuePaths({ ...valid, floors: 2, color: 'red' }, schema)).toEqual([''])
    expect(issuePaths(valid, schema)).toEqual(['floors'])
  })
})
