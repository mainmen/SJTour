import { CalendarDaysIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { EventRecord } from '@/core/modules/events/schema'
import { formatDateRange } from '@/core/services/dates'
import { useLanguage } from '@/web/state/useLanguage'

/** An event's dates, formatted per locale in Montreal time. */
export function EventDates({ event }: { event: EventRecord }) {
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <p className="flex items-start gap-2 font-medium text-ink">
      <CalendarDaysIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-muted" />
      <span className="sr-only">{t('events.dates')} </span>
      <time dateTime={event.startDate}>
        {formatDateRange(new Date(event.startDate), new Date(event.endDate), language)}
      </time>
    </p>
  )
}
