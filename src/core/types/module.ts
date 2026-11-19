import type { z } from 'zod'
import type { BaseRecord } from '@/core/schemas/base'
import type { CategoryId } from '@/core/types/category'

/**
 * Core side of a category module: everything needed to load, validate and
 * select its records. Platform-agnostic (no UI types).
 */
export interface CoreCategoryModule<T extends BaseRecord = BaseRecord> {
  readonly id: CategoryId
  /** Path of the data file, relative to the app's base URL (e.g. `data/companies.json`). */
  readonly dataFile: string
  /** Validates one record. */
  readonly recordSchema: z.ZodType<T>
  /** Records drawn on the map at time `now`. All records when absent. */
  visibleOnMap?(records: readonly T[], now: Date): readonly T[]
}

/** Marker styles; each maps to a colour and is always paired with the category icon. */
export type CategoryTone = 'companies' | 'activities' | 'events' | 'trails'

/**
 * Presentation side of a category module. Generic over the platform's card
 * component, icon and translation-key types (`C`, `I`, `K`) so the contract
 * lives in core without importing React; `src/web/modules/types.ts` fixes them.
 */
export interface CategoryPresentation<C, I, K extends string = string> {
  readonly id: CategoryId
  /** Translation key of the category label. */
  readonly labelKey: K
  readonly Icon: I
  readonly tone: CategoryTone
  /** Card shown in the bottom sheet when a record is selected. */
  readonly Card: C
}
