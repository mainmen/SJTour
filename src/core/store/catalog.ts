import { createStore } from 'zustand/vanilla'
import type { BaseRecord } from '@/core/schemas/base'
import {
  loadCollection,
  type JsonSource,
  type LoadError,
  type LoadOptions,
} from '@/core/services/loader'
import type { CategoryId } from '@/core/types/category'
import type { CoreCategoryModule } from '@/core/types/module'

export type CollectionState<T extends BaseRecord = BaseRecord> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly records: readonly T[] }
  | { readonly status: 'error'; readonly error: LoadError }

export const IDLE = { status: 'idle' } as const satisfies CollectionState

export type CatalogState = {
  readonly collections: Partial<Record<CategoryId, CollectionState>>
  /**
   * Loads a module's records. Does nothing while it is loading or once it has
   * loaded, unless `reload` is set (e.g. a Retry after an error).
   */
  load(module: CoreCategoryModule, options?: { reload?: boolean }): Promise<void>
}

/** Loaded records per category, shared by every screen (map, lists). */
export function createCatalogStore(source: JsonSource, options: LoadOptions) {
  return createStore<CatalogState>()((set, get) => {
    const setCollection = (id: CategoryId, state: CollectionState) =>
      set({ collections: { ...get().collections, [id]: state } })

    return {
      collections: {},
      async load(module, { reload = false } = {}) {
        const status = get().collections[module.id]?.status ?? 'idle'
        if (status === 'loading' || (status === 'success' && !reload)) return
        setCollection(module.id, { status: 'loading' })
        const result = await loadCollection(source, module, options)
        setCollection(
          module.id,
          result.status === 'success'
            ? { status: 'success', records: result.records }
            : { status: 'error', error: result.error },
        )
      },
    }
  })
}

export type CatalogStore = ReturnType<typeof createCatalogStore>

/** A module's collection state, typed with its record type. */
export function selectCollection<T extends BaseRecord>(
  state: CatalogState,
  module: CoreCategoryModule<T>,
): CollectionState<T> {
  return (state.collections[module.id] as CollectionState<T> | undefined) ?? IDLE
}
