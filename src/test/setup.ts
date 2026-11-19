import '@testing-library/jest-dom/vitest'

// jsdom has no AnimationEvent. Without it React listens for the prefixed
// `webkitAnimationEnd` instead of `animationend`, unlike real browsers.
// (Node-environment tests have no window and skip this.)
if (typeof window !== 'undefined' && !('AnimationEvent' in window)) {
  class AnimationEventPolyfill extends Event {
    readonly animationName: string
    readonly elapsedTime: number
    readonly pseudoElement: string
    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init)
      this.animationName = init.animationName ?? ''
      this.elapsedTime = init.elapsedTime ?? 0
      this.pseudoElement = init.pseudoElement ?? ''
    }
  }
  // Assigned directly (not vi.stubGlobal) so afterEach's unstubAllGlobals keeps it.
  Object.defineProperty(window, 'AnimationEvent', {
    value: AnimationEventPolyfill,
    configurable: true,
    writable: true,
  })
}

// i18n needs the DOM (it sets <html lang>), so Node-environment tests skip it.
// Tests run in French, the default language (specs/2026-11-19-i18n D7).
if (typeof window !== 'undefined') {
  const { i18n } = await import('@/web/i18n')
  await i18n.changeLanguage('fr') // before test modules load (some build tables from t())
  beforeEach(async () => {
    await i18n.changeLanguage('fr')
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  if (typeof window !== 'undefined') localStorage.clear()
})
