import { isLayerId, LAYER_IDS, normalizeLayers, type LayerId } from '@/core/filters/layers'

/** Query parameter mirroring the enabled layers: `?layers=companies,walking`. */
export const LAYERS_PARAM = 'layers'

/**
 * Reads the `layers` parameter:
 * - absent → `null` (no opinion: keep the current filters);
 * - empty → `[]` (every layer off);
 * - otherwise the known ids it lists, in display order (unknown ids are ignored);
 *   `null` when it lists none that is known, so a broken link shows the default.
 */
export function parseLayersParam(value: string | null): LayerId[] | null {
  if (value === null) return null
  if (value.trim() === '') return []
  const ids = value.split(',').map((part) => part.trim())
  const known = ids.filter(isLayerId)
  return known.length > 0 ? normalizeLayers(known) : null
}

/** The `layers` value for `enabled`, or `null` when every layer is on (the default, no parameter). */
export function serializeLayers(enabled: readonly LayerId[]): string | null {
  const ids = normalizeLayers(enabled)
  if (ids.length === LAYER_IDS.length) return null
  return ids.join(',')
}
