import type { EventRecord } from '@/core/modules/events/schema'
import { EventDates } from '@/web/modules/events/EventDates'
import type { CardProps } from '@/web/modules/types'

export function EventSummary({ record }: CardProps<EventRecord>) {
  return <EventDates event={record} />
}
