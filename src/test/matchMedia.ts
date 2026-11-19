/**
 * Stubs `window.matchMedia` so `(prefers-reduced-motion: reduce)` matches or not.
 * Other queries never match. Undone after each test by `vi.unstubAllGlobals()` (see setup.ts).
 */
export function stubReducedMotion(reduce: boolean): void {
  vi.stubGlobal('matchMedia', (query: string): MediaQueryList => {
    const matches = reduce && query.includes('prefers-reduced-motion: reduce')
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }
  })
}
