/** Content categories, in display order (specs/mission.md → Content categories). */
export const CATEGORY_IDS = ['companies', 'activities', 'events', 'trails'] as const

export type CategoryId = (typeof CATEGORY_IDS)[number]

/** Points at one record of one category. */
export type RecordRef = { readonly category: CategoryId; readonly id: string }
