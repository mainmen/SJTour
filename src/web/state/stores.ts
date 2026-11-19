import { useStore } from 'zustand'
import type { StoreApi } from 'zustand/vanilla'
import { createCatalogStore } from '@/core/store/catalog'
import { createFilterStore } from '@/core/store/filters'
import { createLanguageStore } from '@/core/store/language'
import { createSelectionStore } from '@/core/store/selection'
import { createFetchJsonSource } from '@/web/adapters/jsonSource'

/**
 * Sample records stay visible until real data replaces them in Phase 13
 * (specs/2026-11-19-data-layer D4); the UI badges each one as sample data.
 */
export const INCLUDE_SAMPLE_DATA = true

/** The app's store instances (core factories, browser adapters). */
export const selectionStore = createSelectionStore()
export const languageStore = createLanguageStore()
export const filterStore = createFilterStore()
export const catalogStore = createCatalogStore(createFetchJsonSource(), {
  includeSamples: INCLUDE_SAMPLE_DATA,
})

/** Subscribes a component to a slice of a core (vanilla) store. */
export function useAppStore<S, U>(store: StoreApi<S>, selector: (state: S) => U): U {
  return useStore(store, selector)
}
