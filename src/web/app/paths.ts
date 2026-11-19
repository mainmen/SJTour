import type { RecordRef } from '@/core/types/category'

/** The detail page of a record: `/companies/boulangerie-exemple` (deep-linkable). */
export function recordPath({ category, id }: RecordRef): string {
  return `/${encodeURIComponent(category)}/${encodeURIComponent(id)}`
}
