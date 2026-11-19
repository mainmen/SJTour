import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { isRecordShown, visibleRecords } from '@/core/filters/selectors'
import { searchTokens } from '@/core/search/text'
import { LayerFilter } from '@/web/filters/LayerFilter'
import { SearchBox } from '@/web/filters/SearchBox'
import { BottomSheet } from '@/web/map/BottomSheet'
import { CategoryMarkers } from '@/web/map/CategoryMarkers'
import { LoadErrors } from '@/web/map/LoadErrors'
import { MapCanvas } from '@/web/map/MapCanvas'
import { RevealSelection } from '@/web/map/RevealSelection'
import { useSelectedRecord } from '@/web/map/useSelectedRecord'
import { webModules } from '@/web/modules/registry'
import { catalogStore, filterStore, selectionStore, useAppStore } from '@/web/state/stores'

/** Closes the card when the user hides the selected record (layers or search). */
function useClearHiddenSelection() {
  const selected = useSelectedRecord()
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const query = useAppStore(filterStore, (state) => state.query)
  useEffect(() => {
    if (selected && !isRecordShown(selected.module.core, selected.record, enabled, query)) {
      selectionStore.getState().clear()
    }
  }, [selected, enabled, query])
}

/**
 * While searching, how many places the map shows, with a link to the list.
 * The live region stays mounted (empty when not searching) so screen readers
 * announce each new count.
 */
function SearchResults() {
  const { t } = useTranslation()
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const query = useAppStore(filterStore, (state) => state.query)
  const collections = useAppStore(catalogStore, (state) => state.collections)
  const searching = searchTokens(query).length > 0

  const count = useMemo(() => {
    if (!searching) return 0
    const now = new Date()
    return webModules.reduce((sum, module) => {
      const collection = collections[module.id]
      if (collection?.status !== 'success') return sum
      return sum + visibleRecords(module.core, collection.records, enabled, now, query).length
    }, 0)
  }, [searching, collections, enabled, query])

  return (
    <div
      role="status"
      className={
        searching
          ? 'glass pointer-events-auto flex items-center justify-between gap-3 self-start rounded-full border border-glass-border pl-3 pr-1 text-sm text-ink shadow-sm'
          : 'sr-only'
      }
    >
      {searching && (
        <>
          <span>
            {count === 0
              ? t('search.noResults', { query: query.trim() })
              : t('search.results', { count })}
          </span>
          <Link
            to="/list"
            className="flex min-h-11 items-center rounded-full px-2 font-semibold text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {t('search.seeList')}
          </Link>
        </>
      )}
    </div>
  )
}

/**
 * The home page: a full-screen map with every category's markers, the search
 * box, the layer chips and the selected record's card. Loaded lazily (see MapRoute) so
 * Leaflet stays out of the main bundle.
 */
export function MapPage() {
  const { t } = useTranslation()
  useClearHiddenSelection()

  useEffect(() => {
    for (const module of webModules) void catalogStore.getState().load(module.core)
  }, [])

  return (
    <section className="relative size-full">
      <h2 className="sr-only">{t('pages.map.title')}</h2>
      <MapCanvas>
        {webModules.map((module) => (
          <CategoryMarkers key={module.id} module={module} />
        ))}
        <RevealSelection />
      </MapCanvas>
      {/* Search, chips and load errors float under the header, above the map. */}
      <div
        className="pointer-events-none absolute inset-x-2 z-[1100] mx-auto flex max-w-2xl flex-col gap-2"
        style={{ top: 'calc(var(--shell-bar-height) + 1px + env(safe-area-inset-top) + 8px)' }}
      >
        <SearchBox className="pointer-events-auto" />
        <LayerFilter className="pointer-events-auto" />
        <SearchResults />
        <LoadErrors modules={webModules} />
      </div>
      <BottomSheet />
    </section>
  )
}
