import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isRecordVisible } from '@/core/filters/selectors'
import { LayerFilter } from '@/web/filters/LayerFilter'
import { BottomSheet } from '@/web/map/BottomSheet'
import { CategoryMarkers } from '@/web/map/CategoryMarkers'
import { LoadErrors } from '@/web/map/LoadErrors'
import { MapCanvas } from '@/web/map/MapCanvas'
import { RevealSelection } from '@/web/map/RevealSelection'
import { useSelectedRecord } from '@/web/map/useSelectedRecord'
import { webModules } from '@/web/modules/registry'
import { catalogStore, filterStore, selectionStore, useAppStore } from '@/web/state/stores'

/** Closes the card when the user hides the selected record's layers. */
function useClearHiddenSelection() {
  const selected = useSelectedRecord()
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  useEffect(() => {
    if (selected && !isRecordVisible(selected.module.core, selected.record, enabled)) {
      selectionStore.getState().clear()
    }
  }, [selected, enabled])
}

/**
 * The home page: a full-screen map with every category's markers, the layer
 * chips and the selected record's card. Loaded lazily (see MapRoute) so
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
      {/* Chips and load errors float under the header, above the map. */}
      <div
        className="pointer-events-none absolute inset-x-2 z-[1100] mx-auto flex max-w-2xl flex-col gap-2"
        style={{ top: 'calc(var(--shell-bar-height) + 1px + env(safe-area-inset-top) + 8px)' }}
      >
        <LayerFilter className="pointer-events-auto" />
        <LoadErrors modules={webModules} />
      </div>
      <BottomSheet />
    </section>
  )
}
