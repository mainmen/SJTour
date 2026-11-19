import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { eventsModule } from '@/core/modules/events/module'
import type { EventRecord } from '@/core/modules/events/schema'
import { selectRecent, selectUpcoming } from '@/core/modules/events/selectors'
import { selectCollection } from '@/core/store/catalog'
import { eventsWebModule } from '@/web/modules/events'
import { EventList } from '@/web/modules/events/EventList'
import { catalogStore, useAppStore } from '@/web/state/stores'
import { useShowOnMap } from '@/web/state/useShowOnMap'
import { RippleButton } from '@/web/ui/RippleButton'
import { Tabs } from '@/web/ui/Tabs'

/**
 * Events in two tabs, Upcoming and Recent (ended in the last 30 days), each
 * with a "Show on map" action. Loaded lazily (see EventsRoute).
 */
export function EventsPage() {
  const { t } = useTranslation()
  const showOnMapFor = useShowOnMap()
  const collection = useAppStore(catalogStore, (state) => selectCollection(state, eventsModule))
  const [now] = useState(() => new Date())

  useEffect(() => {
    void catalogStore.getState().load(eventsModule)
  }, [])

  const lists = useMemo(() => {
    if (collection.status !== 'success') return null
    return {
      upcoming: selectUpcoming(collection.records, now),
      recent: selectRecent(collection.records, now),
    }
  }, [collection, now])

  const showOnMap = (event: EventRecord) => showOnMapFor(eventsWebModule, event)

  return (
    <section className="mx-auto max-w-md p-4">
      <h2 className="mb-3 text-lg font-semibold text-ink">{t('pages.events.title')}</h2>
      {collection.status === 'error' ? (
        <div role="alert" className="flex items-center gap-3 text-sm text-ink">
          <p className="flex-1">{t('events.loadError')}</p>
          <RippleButton
            onClick={() => void catalogStore.getState().load(eventsModule, { reload: true })}
            className="min-h-11 rounded-lg px-3 font-semibold text-accent"
          >
            {t('map.retry')}
          </RippleButton>
        </div>
      ) : lists === null ? (
        <p role="status" className="text-ink-muted">
          {t('events.loading')}
        </p>
      ) : (
        <Tabs
          label={t('events.tabsLabel')}
          tabs={[
            {
              id: 'upcoming',
              label: t('events.upcoming'),
              panel: (
                <EventList
                  events={lists.upcoming}
                  emptyMessage={t('events.emptyUpcoming')}
                  onShowOnMap={showOnMap}
                />
              ),
            },
            {
              id: 'recent',
              label: t('events.recent'),
              panel: (
                <EventList
                  events={lists.recent}
                  emptyMessage={t('events.emptyRecent')}
                  onShowOnMap={showOnMap}
                />
              ),
            },
          ]}
        />
      )}
    </section>
  )
}
