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

afterEach(() => {
  vi.unstubAllGlobals()
})
