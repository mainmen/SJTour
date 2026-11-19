import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { enabledModuleLayers, visibleRecords } from '@/core/filters/selectors'
import { selectCollection } from '@/core/store/catalog'
import { isSelected } from '@/core/store/selection'
import { pickText } from '@/core/types/bilingual'
import { PoiMarker } from '@/web/map/PoiMarker'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, filterStore, selectionStore, useAppStore } from '@/web/state/stores'
import { useLanguage } from '@/web/state/useLanguage'

/**
 * The markers (and overlay, if any) of one category, once its records have
 * loaded: only records in a layer that is switched on and matching the search.
 */
export function CategoryMarkers({ module }: { module: WebCategoryModule }) {
  const { t } = useTranslation()
  const language = useLanguage()
  const collection = useAppStore(catalogStore, (state) => selectCollection(state, module.core))
  const selected = useAppStore(selectionStore, (state) => state.selected)
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const query = useAppStore(filterStore, (state) => state.query)

  const records = useMemo(() => {
    if (collection.status !== 'success') return []
    return visibleRecords(module.core, collection.records, enabled, new Date(), query)
  }, [collection, module, enabled, query])
  const layers = useMemo(() => enabledModuleLayers(module.core, enabled), [module, enabled])

  const categoryLabel = t(module.labelKey)
  const { Overlay } = module
  return (
    <>
      {Overlay && <Overlay records={records} layers={layers} />}
      {records.map((record) => (
        <PoiMarker
          key={record.id}
          position={record.coordinates}
          label={t('map.marker', {
            name: pickText(record.name, language),
            category: categoryLabel,
          })}
          recordKey={`${module.id}/${record.id}`}
          Icon={module.Icon}
          tone={module.tone}
          selected={isSelected(selected, { category: module.id, id: record.id })}
          onSelect={() =>
            selectionStore.getState().select({ category: module.id, id: record.id, origin: 'map' })
          }
        />
      ))}
    </>
  )
}
