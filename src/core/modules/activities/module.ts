import { activitySchema, type Activity } from '@/core/modules/activities/schema'
import type { CoreCategoryModule } from '@/core/types/module'

export const activitiesModule: CoreCategoryModule<Activity> = {
  id: 'activities',
  layers: [{ id: 'activities' }],
  dataFile: 'data/activities.json',
  recordSchema: activitySchema,
}
