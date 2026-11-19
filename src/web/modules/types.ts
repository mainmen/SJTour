import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { LayerId } from '@/core/filters/layers'
import type { BaseRecord } from '@/core/schemas/base'
import type { CategoryId } from '@/core/types/category'
import type { CategoryPresentation, CoreCategoryModule } from '@/core/types/module'

export type CardProps<T extends BaseRecord> = { readonly record: T }

/** Props of a category's map overlay: the records drawn, and which of the module's layers are on. */
export type OverlayProps<T extends BaseRecord> = {
  readonly records: readonly T[]
  readonly layers: readonly LayerId[]
}

/** Translation key of a map layer label. */
export type LayerLabelKey = `layers.${LayerId}`

/** How a layer appears in the filter chips. Ids match the core module's `layers`. */
export type WebLayer = {
  readonly id: LayerId
  readonly labelKey: LayerLabelKey
  readonly Icon: LucideIcon
}

/** Translation key of a category label. */
export type CategoryLabelKey = `categories.${CategoryId}`

/**
 * A category module as the web app uses it: its core side plus the React
 * presentation (the core contract with React types filled in).
 */
export type WebCategoryModule<T extends BaseRecord = BaseRecord> = CategoryPresentation<
  ComponentType<CardProps<T>>,
  LucideIcon,
  CategoryLabelKey
> & {
  readonly core: CoreCategoryModule<T>
  /** One-line summary of a record in the list view (facets, dates, length…). */
  readonly Summary: ComponentType<CardProps<T>>
  /** Filter chips for the module's layers, in display order. */
  readonly layers: readonly WebLayer[]
  /**
   * Map layer drawn under the markers, for records with a shape (trail lines).
   * Rendered inside the map; point-only categories leave it out.
   */
  readonly Overlay?: ComponentType<OverlayProps<T>>
}

/**
 * Checks a module against its record type, then widens it for the registry.
 * Safe because a module's card only ever receives records its own core side loaded.
 */
export function defineWebModule<T extends BaseRecord>(module: WebCategoryModule<T>) {
  return module as unknown as WebCategoryModule
}
