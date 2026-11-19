import { validateCollection } from '@/core/services/loader'
import { readDataFile } from '@/core/test/dataFiles'
import type { BaseRecord } from '@/core/schemas/base'
import type { CoreCategoryModule } from '@/core/types/module'

/** A module's shipped records, validated (throws if the file is invalid). */
export function shippedRecords<T extends BaseRecord>(module: CoreCategoryModule<T>): readonly T[] {
  const result = validateCollection(module, readDataFile(module.dataFile))
  if (result.status === 'error') throw new Error(JSON.stringify(result.error))
  return result.records
}
