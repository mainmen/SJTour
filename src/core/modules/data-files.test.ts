import { coreModules } from '@/core/modules/registry'
import { validateCollection } from '@/core/services/loader'

// Build-time check (runs in CI): every shipped data file matches its module's schema.
const files = import.meta.glob<unknown>('/public/data/*.json', { eager: true, import: 'default' })

/** The parsed content of `public/<dataFile>`. */
function dataFile(dataFile: string): unknown {
  return files[`/public/${dataFile}`]
}

describe('data files', () => {
  it('every data file belongs to a registered module', () => {
    const expected = coreModules.map((module) => `/public/${module.dataFile}`).sort()
    expect(Object.keys(files).sort()).toEqual(expected)
  })

  it.each(coreModules.map((module) => [module.id, module] as const))(
    '%s data validates',
    (_id, module) => {
      const result = validateCollection(module, dataFile(module.dataFile))
      expect(result.status === 'error' ? result.error : null).toBeNull()
    },
  )
})
