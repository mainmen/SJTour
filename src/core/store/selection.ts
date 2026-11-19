import { createStore } from 'zustand/vanilla'
import type { RecordRef } from '@/core/types/category'

/**
 * Where a selection came from: a tap on the map, or a list's "Show on map",
 * which asks the map to zoom to the record.
 */
export type SelectionOrigin = 'map' | 'list'

export type Selection = RecordRef & { readonly origin: SelectionOrigin }

export type SelectionState = {
  readonly selected: Selection | null
  select(selection: Selection): void
  clear(): void
}

/** The record currently selected (its card is open). */
export function createSelectionStore() {
  return createStore<SelectionState>()((set) => ({
    selected: null,
    select: (selection) => set({ selected: selection }),
    clear: () => set({ selected: null }),
  }))
}

export type SelectionStore = ReturnType<typeof createSelectionStore>

/** Whether `selection` points at the given record. */
export function isSelected(selection: Selection | null, ref: RecordRef): boolean {
  return selection?.category === ref.category && selection.id === ref.id
}
