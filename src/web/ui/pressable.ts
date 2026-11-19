/**
 * Classes for anything that hosts a ripple: positions and clips the ripple,
 * adds a static pressed tint (feedback that works with reduced motion too)
 * and a visible keyboard focus ring.
 */
export const pressableClass =
  'relative isolate overflow-hidden select-none [-webkit-tap-highlight-color:transparent] active:bg-ink/10 focus-visible:outline-2 focus-visible:outline-focus'
