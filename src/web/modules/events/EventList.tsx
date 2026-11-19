import { MapPinIcon } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { EventRecord } from '@/core/modules/events/schema'
import { pickText } from '@/core/types/bilingual'
import { EventDates } from '@/web/modules/events/EventDates'
import { Badge } from '@/web/modules/shared/RecordBody'
import { useLanguage } from '@/web/state/useLanguage'
import { RippleButton } from '@/web/ui/RippleButton'

type EventListProps = {
  readonly events: readonly EventRecord[]
  /** Shown when there are no events. */
  readonly emptyMessage: string
  readonly onShowOnMap: (event: EventRecord) => void
}

function EventItem({ event, onShowOnMap }: { event: EventRecord; onShowOnMap: () => void }) {
  const { t } = useTranslation()
  const language = useLanguage()
  const titleId = useId()
  const name = pickText(event.name, language)
  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col gap-2 rounded-xl border border-glass-border bg-surface p-4 text-sm shadow-sm"
    >
      <h3 id={titleId} className="text-base leading-snug font-semibold text-ink">
        {name}
      </h3>
      <EventDates event={event} />
      {event.address && <p className="text-ink-muted">{event.address}</p>}
      {event.sample && (
        <p>
          <Badge tone="sample">{t('card.sample')}</Badge>
        </p>
      )}
      <RippleButton
        aria-label={t('events.showOnMapNamed', { name })}
        onClick={onShowOnMap}
        className="mt-1 flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-accent px-3 font-semibold text-accent"
      >
        <MapPinIcon aria-hidden="true" className="size-4" />
        {t('events.showOnMap')}
      </RippleButton>
    </article>
  )
}

/** A list of events, each with its dates and a "Show on map" action. */
export function EventList({ events, emptyMessage, onShowOnMap }: EventListProps) {
  if (events.length === 0) return <p className="text-ink-muted">{emptyMessage}</p>
  return (
    <ul className="flex flex-col gap-3">
      {events.map((event) => (
        <li key={event.id}>
          <EventItem event={event} onShowOnMap={() => onShowOnMap(event)} />
        </li>
      ))}
    </ul>
  )
}
