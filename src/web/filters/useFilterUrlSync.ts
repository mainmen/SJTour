import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { LAYERS_PARAM, parseLayersParam, serializeLayers } from '@/core/filters/url'
import { filterStore, useAppStore } from '@/web/state/stores'

/**
 * Mirrors the filter store to `?layers=` so a view can be shared
 * (specs/2026-11-19-filtering D3):
 * - a URL that carries the parameter sets the filters (a shared link);
 * - otherwise the current filters are written into the URL (replacing the
 *   history entry, so toggling doesn't fill the Back button).
 * Used by the routes that show filtered content: the map and the list.
 */
export function useFilterUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get(LAYERS_PARAM)
  const enabled = useAppStore(filterStore, (state) => state.enabled)

  // URL → store.
  useEffect(() => {
    const parsed = parseLayersParam(raw)
    if (parsed) filterStore.getState().setEnabled(parsed)
  }, [raw])

  // Store → URL. Reads the store, not `enabled`, which is stale when the
  // effect above has just applied the URL in the same commit.
  useEffect(() => {
    const wanted = serializeLayers(filterStore.getState().enabled)
    if (wanted === raw) return
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (wanted === null) next.delete(LAYERS_PARAM)
        else next.set(LAYERS_PARAM, wanted)
        return next
      },
      { replace: true },
    )
  }, [enabled, raw, setSearchParams])
}
