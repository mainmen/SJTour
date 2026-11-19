import { useNavigate } from 'react-router'
import { recordLayers } from '@/core/filters/selectors'
import type { BaseRecord } from '@/core/schemas/base'
import { matchesSearch } from '@/core/search/text'
import type { WebCategoryModule } from '@/web/modules/types'
import { filterStore, selectionStore } from '@/web/state/stores'

/**
 * "Show on map" from a list or a detail page: switches on the record's layers
 * if they are hidden, clears a search it doesn't match
 * (specs/2026-11-19-search D6), selects it as from a list (the map zooms to it and opens
 * its card) and goes to the map.
 */
export function useShowOnMap() {
  const navigate = useNavigate()
  return (module: WebCategoryModule, record: BaseRecord) => {
    const layers = recordLayers(module.core, record)
    if (!layers.some((id) => filterStore.getState().enabled.includes(id))) {
      filterStore.getState().enable(layers)
    }
    if (!matchesSearch(record, filterStore.getState().query)) filterStore.getState().clearQuery()
    selectionStore.getState().select({ category: module.id, id: record.id, origin: 'list' })
    void navigate('/')
  }
}
