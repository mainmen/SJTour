import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EventRecord } from '@/core/modules/events/schema'
import { eventStatus } from '@/core/modules/events/selectors'
import { EventDates } from '@/web/modules/events/EventDates'
import { RecordBody } from '@/web/modules/shared/RecordBody'
import type { CardProps } from '@/web/modules/types'

export function EventCard({ record }: CardProps<EventRecord>) {
  const { t } = useTranslation()
  const [now] = useState(() => new Date())
  return (
    <RecordBody record={record} badges={[t(`events.status.${eventStatus(record, now)}`)]}>
      <EventDates event={record} />
    </RecordBody>
  )
}
