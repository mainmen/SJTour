import { coreModules } from '@/core/modules/registry'
import { validateCollection } from '@/core/services/loader'
import { dataFilePaths, readDataFile } from '@/core/test/dataFiles'

// Build-time check (runs in CI): every shipped data file matches its module's schema.
describe('data files', () => {
  it('every data file belongs to a registered module, and vice versa', () => {
    expect([...dataFilePaths].sort()).toEqual(coreModules.map((m) => m.dataFile).sort())
  })

  it.each(coreModules.map((module) => [module.id, module] as const))(
    '%s data validates',
    (_id, module) => {
      const result = validateCollection(module, readDataFile(module.dataFile))
      expect(result.status === 'error' ? result.error : null).toBeNull()
    },
  )
})
