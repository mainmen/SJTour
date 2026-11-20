import { useEffect, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { LAYER_IDS } from '@/core/filters/layers'
import { enabledModuleLayers, isRecordShown, visibleRecords } from '@/core/filters/selectors'
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
import { RippleButton } from '@/web/ui/RippleButton'

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

type MapStatusMode = 'idle' | 'loading' | 'noLayers' | 'search' | 'empty'

/**
 * One line under the chips telling what the map shows (specs/2026-11-19-mvp-release D4):
 * places still loading; no layer on (with Show all); while searching, the
 * number of results with a link to the list; or nothing to show with the
 * current filters. The live region stays mounted (empty when there is nothing
 * to say) so screen readers announce each change.
 */
function MapStatus() {
  const { t } = useTranslation()
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const query = useAppStore(filterStore, (state) => state.query)
  const collections = useAppStore(catalogStore, (state) => state.collections)
  const searching = searchTokens(query).length > 0

  const { mode, count } = useMemo((): { mode: MapStatusMode; count: number } => {
    const shown = webModules.filter(
      (module) => enabledModuleLayers(module.core, enabled).length > 0,
    )
    if (shown.length === 0) return { mode: 'noLayers', count: 0 }
    const states = shown.map((module) => collections[module.id]?.status ?? 'idle')
    if (states.some((status) => status === 'idle' || status === 'loading')) {
      return { mode: 'loading', count: 0 }
    }
    const now = new Date()
    const count = shown.reduce((sum, module) => {
      const collection = collections[module.id]
      if (collection?.status !== 'success') return sum
      return sum + visibleRecords(module.core, collection.records, enabled, now, query).length
    }, 0)
    if (searching) return { mode: 'search', count }
    // A failed category has its own alert (LoadErrors); don't also call the map empty.
    if (count === 0 && !states.includes('error')) return { mode: 'empty', count }
    return { mode: 'idle', count }
  }, [collections, enabled, query, searching])

  const action =
    'flex min-h-11 shrink-0 items-center rounded-full px-2 font-semibold text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
  const showAll = (
    <RippleButton className={action} onClick={() => filterStore.getState().showAll()}>
      {t('list.showAll')}
    </RippleButton>
  )

  let content: ReactNode = null
  if (mode === 'loading') content = <span className="py-2.5">{t('map.loadingPlaces')}</span>
  else if (mode === 'noLayers') {
    content = (
      <>
        <span>{t('list.noLayers')}</span>
        {showAll}
      </>
    )
  } else if (mode === 'search') {
    content = (
      <>
        <span>
          {count === 0
            ? t('search.noResults', { query: query.trim() })
            : t('search.results', { count })}
        </span>
        <Link to="/list" className={action}>
          {t('search.seeList')}
        </Link>
      </>
    )
  } else if (mode === 'empty') {
    content = (
      <>
        <span>{t('map.empty')}</span>
        {enabled.length < LAYER_IDS.length && showAll}
      </>
    )
  }

  return (
    <div
      role="status"
      className={
        content
          ? 'glass pointer-events-auto flex items-center justify-between gap-3 self-start rounded-full border border-glass-border pr-1 pl-3 text-sm text-ink shadow-sm'
          : 'sr-only'
      }
    >
      {content}
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
        <MapStatus />
        <LoadErrors modules={webModules} />
      </div>
      <BottomSheet />
    </section>
  )
}
