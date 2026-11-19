/**
 * Map layers a user can switch on and off (FilterChips), in display order.
 * Point categories are one layer each; trails split into walking and biking
 * layers (specs/mission.md → Trails).
 */
export const LAYER_IDS = ['companies', 'activities', 'events', 'walking', 'biking'] as const

export type LayerId = (typeof LAYER_IDS)[number]

export function isLayerId(value: unknown): value is LayerId {
  return typeof value === 'string' && (LAYER_IDS as readonly string[]).includes(value)
}

/** One of a module's layers: which of its records it shows (all when `includes` is absent). */
export type MapLayer<T> = {
  readonly id: LayerId
  includes?(record: T): boolean
}

/** Distinct layer ids, in display order. */
export function normalizeLayers(ids: Iterable<LayerId>): LayerId[] {
  const set = new Set(ids)
  return LAYER_IDS.filter((id) => set.has(id))
}
