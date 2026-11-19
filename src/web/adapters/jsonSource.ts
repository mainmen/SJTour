import type { JsonSource } from '@/core/services/loader'

/**
 * Fetches data files shipped with the app (`public/data/…`), relative to the
 * app's base URL. Throws on network errors, non-2xx responses and bad JSON;
 * the core loader turns that into an `unavailable` error.
 */
export function createFetchJsonSource(baseUrl: string = import.meta.env.BASE_URL): JsonSource {
  return {
    async getJson(path) {
      const url = `${baseUrl.replace(/\/?$/, '/')}${path}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`GET ${url} failed: HTTP ${response.status}`)
      return (await response.json()) as unknown
    },
  }
}
