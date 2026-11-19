import { companiesModule } from '@/core/modules/companies/module'
import { companySchema, SECTORS, type Company } from '@/core/modules/companies/schema'
import { bySector, parks } from '@/core/modules/companies/selectors'
import { loadCollection } from '@/core/services/loader'
import { fakeSource } from '@/core/test/fixtures'
import { shippedRecords } from '@/core/test/records'

function company(overrides: Partial<Company> = {}): Company {
  return {
    id: 'cafe',
    category: 'companies',
    name: { fr: 'Café', en: 'Café' },
    description: { fr: 'Un café.', en: 'A café.' },
    coordinates: [45.3058, -73.2533],
    lastVerified: '2026-11-19',
    sector: 'food',
    kind: 'business',
    ...overrides,
  }
}

describe('companySchema', () => {
  it('accepts a business and a park', () => {
    expect(companySchema.safeParse(company()).success).toBe(true)
    expect(companySchema.safeParse(company({ kind: 'park', sector: 'mixed' })).success).toBe(true)
  })

  it.each(SECTORS)('accepts the %s sector', (sector) => {
    expect(companySchema.safeParse(company({ sector })).success).toBe(true)
  })

  it.each([
    ['an unknown sector', { sector: 'mining' }, 'sector'],
    ['an unknown kind', { kind: 'factory' }, 'kind'],
    ['a missing sector', { sector: undefined }, 'sector'],
    ['another category', { category: 'events' }, 'category'],
  ])('rejects %s', (_label, patch, path) => {
    const result = companySchema.safeParse({ ...company(), ...patch })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain(path)
  })
})

describe('company selectors', () => {
  const cafe = company()
  const park = company({ id: 'park', kind: 'park', sector: 'manufacturing' })
  const shop = company({ id: 'shop', sector: 'retail' })

  it('parks keeps only parks and districts', () => {
    expect(parks([cafe, park, shop])).toEqual([park])
  })

  it('bySector keeps one sector', () => {
    expect(bySector([cafe, park, shop], 'retail')).toEqual([shop])
    expect(bySector([cafe, park, shop], 'health')).toEqual([])
  })
})

describe('companies module', () => {
  it('loads its data file through the generic loader', async () => {
    const source = fakeSource({ 'data/companies.json': [company()] })
    const result = await loadCollection(source, companiesModule, { includeSamples: true })
    expect(result).toEqual({ status: 'success', records: [company()] })
  })

  describe('shipped data', () => {
    const records = shippedRecords(companiesModule)

    it('includes Parc industriel Iberville as a park', () => {
      expect(parks(records).map((r) => r.id)).toContain('parc-industriel-iberville')
    })

    it('flags every record as sample data (until Phase 13)', () => {
      expect(records.length).toBeGreaterThan(0)
      expect(records.every((r) => r.sample === true)).toBe(true)
    })
  })
})
