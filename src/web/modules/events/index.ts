import { CalendarDaysIcon } from 'lucide-react'
import { eventsModule as core } from '@/core/modules/events/module'
import { EventCard } from '@/web/modules/events/EventCard'
import { defineWebModule } from '@/web/modules/types'

export const eventsWebModule = defineWebModule({
  id: 'events',
  core,
  labelKey: 'categories.events',
  Icon: CalendarDaysIcon,
  tone: 'events',
  Card: EventCard,
})
