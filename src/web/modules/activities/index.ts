import { TreesIcon } from 'lucide-react'
import { activitiesModule as core } from '@/core/modules/activities/module'
import { ActivityCard } from '@/web/modules/activities/ActivityCard'
import { defineWebModule } from '@/web/modules/types'

export const activitiesWebModule = defineWebModule({
  id: 'activities',
  core,
  labelKey: 'categories.activities',
  Icon: TreesIcon,
  tone: 'activities',
  Card: ActivityCard,
})
