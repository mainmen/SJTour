import { createStore } from 'zustand/vanilla'
import { LAYER_IDS, normalizeLayers, type LayerId } from '@/core/filters/layers'

export type FilterState = {
  /** Enabled map layers, distinct and in display order. All by default. */
  readonly enabled: readonly LayerId[]
  /** Switches one layer on or off. */
  toggle(id: LayerId): void
  /** Replaces the enabled layers (e.g. from the URL). */
  setEnabled(ids: Iterable<LayerId>): void
  /** Switches layers on, keeping the others as they are. */
  enable(ids: Iterable<LayerId>): void
  /** Switches every layer on. */
  showAll(): void
}

function sameLayers(a: readonly LayerId[], b: readonly LayerId[]) {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

/** Which map layers are shown, shared by the map and the list. */
export function createFilterStore(initial: Iterable<LayerId> = LAYER_IDS) {
  return createStore<FilterState>()((set, get) => {
    // Keeps the same array when nothing changes, so subscribers don't re-render.
    const update = (ids: Iterable<LayerId>) => {
      const next = normalizeLayers(ids)
      if (!sameLayers(next, get().enabled)) set({ enabled: next })
    }
    return {
      enabled: normalizeLayers(initial),
      toggle(id) {
        const { enabled } = get()
        update(enabled.includes(id) ? enabled.filter((other) => other !== id) : [...enabled, id])
      },
      setEnabled: update,
      enable: (ids) => update([...get().enabled, ...ids]),
      showAll: () => update(LAYER_IDS),
    }
  })
}

export type FilterStore = ReturnType<typeof createFilterStore>

export function isLayerEnabled(state: FilterState, id: LayerId): boolean {
  return state.enabled.includes(id)
}
