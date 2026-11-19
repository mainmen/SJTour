import { readDataFile } from '@/core/test/dataFiles'
import { catalogStore, filterStore, selectionStore } from '@/web/state/stores'

/**
 * Stubs `fetch` to serve the shipped `public/data` files. `overrides` replaces
 * a file's content by path (`data/companies.json`); an `Error` makes that
 * request fail like a network error. Unknown paths answer 404.
 */
export function stubDataFetch(overrides: Record<string, unknown> = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const path = String(input).replace(/^\//, '')
    const value = path in overrides ? overrides[path] : readDataFile(path)
    if (value instanceof Error) throw value
    if (value === undefined) return new Response('Not found', { status: 404 })
    return new Response(JSON.stringify(value), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Empties the app's stores (they are module singletons shared by tests). */
export function resetAppStores() {
  catalogStore.setState({ collections: {} })
  selectionStore.setState({ selected: null })
  filterStore.getState().showAll()
  filterStore.getState().clearQuery()
}
