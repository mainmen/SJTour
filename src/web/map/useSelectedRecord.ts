import { useMemo } from 'react'
import type { BaseRecord } from '@/core/schemas/base'
import type { Selection } from '@/core/store/selection'
import { findWebModule } from '@/web/modules/registry'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, selectionStore, useAppStore } from '@/web/state/stores'

export type SelectedRecord = {
  readonly selection: Selection
  readonly module: WebCategoryModule
  readonly record: BaseRecord
}

/** The selected record with its module, once its category has loaded; otherwise `null`. */
export function useSelectedRecord(): SelectedRecord | null {
  const selection = useAppStore(selectionStore, (state) => state.selected)
  const collections = useAppStore(catalogStore, (state) => state.collections)
  return useMemo(() => {
    if (!selection) return null
    const module = findWebModule(selection.category)
    const collection = collections[selection.category]
    if (!module || collection?.status !== 'success') return null
    const record = collection.records.find((r) => r.id === selection.id)
    return record ? { selection, module, record } : null
  }, [selection, collections])
}
