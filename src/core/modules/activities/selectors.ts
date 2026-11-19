import { SUBCATEGORIES, type Activity, type Subcategory } from '@/core/modules/activities/schema'

/** Activities in one subcategory. */
export function bySubcategory(
  activities: readonly Activity[],
  subcategory: Subcategory,
): Activity[] {
  return activities.filter((activity) => activity.subcategory === subcategory)
}

/** Activities grouped by subcategory, every subcategory present (possibly empty), in display order. */
export function groupBySubcategory(
  activities: readonly Activity[],
): Record<Subcategory, Activity[]> {
  return Object.fromEntries(
    SUBCATEGORIES.map((subcategory) => [subcategory, bySubcategory(activities, subcategory)]),
  ) as Record<Subcategory, Activity[]>
}
