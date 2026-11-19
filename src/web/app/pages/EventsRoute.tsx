import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

// The events page and its validation (Zod) load only when it is shown.
const EventsPage = lazy(() =>
  import('@/web/app/pages/EventsPage').then((module) => ({ default: module.EventsPage })),
)

/** Shown while the events chunk downloads. */
export function EventsLoading() {
  const { t } = useTranslation()
  return (
    <p role="status" className="p-4 text-ink-muted">
      {t('events.loading')}
    </p>
  )
}

export function EventsRoute() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <EventsPage />
    </Suspense>
  )
}
