import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMap, useMapEvents } from 'react-leaflet'
import { enabledModuleLayers, visibleRecords } from '@/core/filters/selectors'
import { clusterPoints, type Cluster } from '@/core/map/cluster'
import type { BaseRecord } from '@/core/schemas/base'
import { selectCollection } from '@/core/store/catalog'
import { isSelected } from '@/core/store/selection'
import { pickText } from '@/core/types/bilingual'
import { ClusterMarker } from '@/web/map/ClusterMarker'
import { PoiMarker } from '@/web/map/PoiMarker'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, filterStore, selectionStore, useAppStore } from '@/web/state/stores'
import { useLanguage } from '@/web/state/useLanguage'

/**
 * The markers (and overlay, if any) of one category, once its records have
 * loaded: only records in a layer that is switched on and matching the search.
 * Markers that would overlap merge into clusters (specs/2026-11-19-mvp-release D2).
 */
export function CategoryMarkers({ module }: { module: WebCategoryModule }) {
  const { t } = useTranslation()
  const language = useLanguage()
  const map = useMap()
  const collection = useAppStore(catalogStore, (state) => selectCollection(state, module.core))
  const selected = useAppStore(selectionStore, (state) => state.selected)
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const query = useAppStore(filterStore, (state) => state.query)
  const [zoom, setZoom] = useState(() => map.getZoom())

  // The selected record always has its own marker. It keeps it after its card
  // closes, until the next zoom, so focus can go back to it.
  const selectedId = selected?.category === module.id ? selected.id : null
  const [pinnedId, setPinnedId] = useState(selectedId)
  if (selectedId !== null && selectedId !== pinnedId) setPinnedId(selectedId)

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom())
      setPinnedId(selectedId)
    },
  })

  const records = useMemo(() => {
    if (collection.status !== 'success') return []
    return visibleRecords(module.core, collection.records, enabled, new Date(), query)
  }, [collection, module, enabled, query])
  const layers = useMemo(() => enabledModuleLayers(module.core, enabled), [module, enabled])

  // One array (the pinned marker last), so a marker keeps its DOM node, and
  // keyboard focus, when it leaves a cluster on selection.
  const clusters = useMemo((): Cluster<BaseRecord>[] => {
    const others = records.filter((record) => record.id !== pinnedId)
    const grouped = clusterPoints(
      others.map((record) => ({ key: record, position: record.coordinates })),
      zoom,
    )
    const pinned = records.find((record) => record.id === pinnedId)
    if (!pinned) return grouped
    const at = pinned.coordinates
    return [...grouped, { keys: [pinned], position: at, bounds: [at, at] }]
  }, [records, zoom, pinnedId])

  const categoryLabel = t(module.labelKey)
  const { Overlay } = module
  const marker = (record: BaseRecord) => (
    <PoiMarker
      key={record.id}
      position={record.coordinates}
      label={t('map.marker', { name: pickText(record.name, language), category: categoryLabel })}
      recordKey={`${module.id}/${record.id}`}
      Icon={module.Icon}
      tone={module.tone}
      selected={isSelected(selected, { category: module.id, id: record.id })}
      onSelect={() =>
        selectionStore.getState().select({ category: module.id, id: record.id, origin: 'map' })
      }
    />
  )

  return (
    <>
      {Overlay && <Overlay records={records} layers={layers} />}
      {clusters.map(({ keys, position, bounds }) =>
        keys.length === 1 ? (
          marker(keys[0]!)
        ) : (
          <ClusterMarker
            key={keys.map((record) => record.id).join('+')}
            position={position}
            bounds={bounds}
            recordKeys={keys.map((record) => `${module.id}/${record.id}`)}
            label={t('map.cluster', { count: keys.length, category: categoryLabel })}
            Icon={module.Icon}
            tone={module.tone}
          />
        ),
      )}
    </>
  )
}
