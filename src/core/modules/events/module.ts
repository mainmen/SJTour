import { eventSchema, type EventRecord } from '@/core/modules/events/schema'
import { selectCurrent } from '@/core/modules/events/selectors'
import type { CoreCategoryModule } from '@/core/types/module'

export const eventsModule: CoreCategoryModule<EventRecord> = {
  id: 'events',
  dataFile: 'data/events.json',
  recordSchema: eventSchema,
  // Past events are not drawn (specs/2026-11-19-events D6).
  visibleOnMap: selectCurrent,
}
