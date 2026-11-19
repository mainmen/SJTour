import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { BaseRecord } from '@/core/schemas/base'
import type { CategoryId } from '@/core/types/category'
import type { CategoryPresentation, CoreCategoryModule } from '@/core/types/module'

export type CardProps<T extends BaseRecord> = { readonly record: T }

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
> & { readonly core: CoreCategoryModule<T> }

/**
 * Checks a module against its record type, then widens it for the registry.
 * Safe because a module's card only ever receives records its own core side loaded.
 */
export function defineWebModule<T extends BaseRecord>(module: WebCategoryModule<T>) {
  return module as unknown as WebCategoryModule
}
