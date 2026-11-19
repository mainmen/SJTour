import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { selectCollection } from '@/core/store/catalog'
import { isSelected } from '@/core/store/selection'
import { pickText } from '@/core/types/bilingual'
import { PoiMarker } from '@/web/map/PoiMarker'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, selectionStore, useAppStore } from '@/web/state/stores'
import { useLanguage } from '@/web/state/useLanguage'

/** The markers of one category, once its records have loaded. */
export function CategoryMarkers({ module }: { module: WebCategoryModule }) {
  const { t } = useTranslation()
  const language = useLanguage()
  const collection = useAppStore(catalogStore, (state) => selectCollection(state, module.core))
  const selected = useAppStore(selectionStore, (state) => state.selected)

  const records = useMemo(() => {
    if (collection.status !== 'success') return []
    return module.core.visibleOnMap
      ? module.core.visibleOnMap(collection.records, new Date())
      : collection.records
  }, [collection, module])

  const categoryLabel = t(module.labelKey)
  return records.map((record) => (
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
  ))
}
