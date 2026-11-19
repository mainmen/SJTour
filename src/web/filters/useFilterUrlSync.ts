import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import {
  LAYERS_PARAM,
  parseLayersParam,
  parseSearchParam,
  SEARCH_PARAM,
  serializeLayers,
  serializeSearch,
} from '@/core/filters/url'
import { filterStore, useAppStore } from '@/web/state/stores'

/**
 * Mirrors the filter store to `?layers=` and `?q=` so a view can be shared
 * (specs/2026-11-19-filtering D3, specs/2026-11-19-search D4):
 * - a URL that carries a parameter sets that filter (a shared link);
 * - otherwise the current filter is written into the URL (replacing the
 *   history entry, so toggling or typing doesn't fill the Back button).
 * Used by the routes that show filtered content: the map and the list.
 */
export function useFilterUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawLayers = searchParams.get(LAYERS_PARAM)
  const rawQuery = searchParams.get(SEARCH_PARAM)
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const query = useAppStore(filterStore, (state) => state.query)
  // `q` values this hook wrote and the URL hasn't shown yet. When one arrives
  // it is our own echo, not a shared link: reading it back could undo
  // keystrokes typed while the navigation was pending.
  const pendingQueries = useRef<(string | null)[]>([])

  // URL → store.
  useEffect(() => {
    const parsed = parseLayersParam(rawLayers)
    if (parsed) filterStore.getState().setEnabled(parsed)
  }, [rawLayers])

  useEffect(() => {
    const pending = pendingQueries.current
    const echo = pending.indexOf(rawQuery)
    if (echo >= 0) {
      pending.splice(0, echo + 1)
      return
    }
    const parsed = parseSearchParam(rawQuery)
    if (parsed !== null) filterStore.getState().setQuery(parsed)
  }, [rawQuery])

  // Store → URL. Reads the store, not `enabled` / `query`, which are stale
  // when the effects above have just applied the URL in the same commit.
  useEffect(() => {
    const state = filterStore.getState()
    const wantedLayers = serializeLayers(state.enabled)
    const wantedQuery = serializeSearch(state.query)
    const pending = pendingQueries.current
    const latestQuery = pending.length > 0 ? pending[pending.length - 1] : rawQuery
    if (wantedLayers === rawLayers && wantedQuery === latestQuery) return
    if (wantedQuery !== latestQuery) pending.push(wantedQuery)
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (wantedLayers === null) next.delete(LAYERS_PARAM)
        else next.set(LAYERS_PARAM, wantedLayers)
        if (wantedQuery === null) next.delete(SEARCH_PARAM)
        else next.set(SEARCH_PARAM, wantedQuery)
        return next
      },
      { replace: true },
    )
  }, [enabled, query, rawLayers, rawQuery, setSearchParams])
}
