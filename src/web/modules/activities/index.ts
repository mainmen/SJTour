import { TreesIcon } from 'lucide-react'
import { activitiesModule as core } from '@/core/modules/activities/module'
import { ActivityCard } from '@/web/modules/activities/ActivityCard'
import { ActivitySummary } from '@/web/modules/activities/ActivitySummary'
import { defineWebModule } from '@/web/modules/types'

export const activitiesWebModule = defineWebModule({
  id: 'activities',
  core,
  labelKey: 'categories.activities',
  Icon: TreesIcon,
  tone: 'activities',
  Card: ActivityCard,
  Summary: ActivitySummary,
  layers: [{ id: 'activities', labelKey: 'layers.activities', Icon: TreesIcon }],
})
