import type { LayerId } from '@/core/filters/layers'
import type { BaseRecord } from '@/core/schemas/base'
import { matchesSearch, searchRecords } from '@/core/search/text'
import type { CoreCategoryModule } from '@/core/types/module'

/** The module's layers that contain `record` (a `both` trail is in walking and biking). */
export function recordLayers<T extends BaseRecord>(
  module: CoreCategoryModule<T>,
  record: T,
): LayerId[] {
  return module.layers.filter((layer) => layer.includes?.(record) ?? true).map((layer) => layer.id)
}

/** The module's layers that are switched on. */
export function enabledModuleLayers(
  module: CoreCategoryModule,
  enabled: readonly LayerId[],
): LayerId[] {
  return module.layers.map((layer) => layer.id).filter((id) => enabled.includes(id))
}

/** Whether a record is in at least one enabled layer. */
export function isRecordVisible<T extends BaseRecord>(
  module: CoreCategoryModule<T>,
  record: T,
  enabled: readonly LayerId[],
): boolean {
  return recordLayers(module, record).some((id) => enabled.includes(id))
}

/** The records in at least one enabled layer, in their original order. */
export function filterRecords<T extends BaseRecord>(
  module: CoreCategoryModule<T>,
  records: readonly T[],
  enabled: readonly LayerId[],
): T[] {
  return records.filter((record) => isRecordVisible(module, record, enabled))
}

/** Whether a record is in an enabled layer and matches the search. */
export function isRecordShown<T extends BaseRecord>(
  module: CoreCategoryModule<T>,
  record: T,
  enabled: readonly LayerId[],
  query: string,
): boolean {
  return isRecordVisible(module, record, enabled) && matchesSearch(record, query)
}

/**
 * What a map or list shows of a module at time `now`: the records it draws
 * (`visibleOnMap`, e.g. no past events) that are in an enabled layer and
 * match the search (blank by default).
 */
export function visibleRecords<T extends BaseRecord>(
  module: CoreCategoryModule<T>,
  records: readonly T[],
  enabled: readonly LayerId[],
  now: Date,
  query = '',
): T[] {
  const drawn = module.visibleOnMap ? module.visibleOnMap(records, now) : records
  return searchRecords(filterRecords(module, drawn, enabled), query)
}
