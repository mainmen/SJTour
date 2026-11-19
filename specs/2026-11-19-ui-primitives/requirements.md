# Phase 1b: UI Primitives — Requirements

- **Branch:** `feature/ui-primitives` (based on `main` after Phase 1 merged in PR #3)
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 1b
- **Guidance:** `specs/mission.md` (principle 11) and `specs/tech-stack.md` → Visual style

## Context

Phase 1 delivered the app shell: a header, a full-height content area and a bottom nav, with React Router and placeholder pages. The header and nav use plain solid Tailwind styling.

This phase adds the two UI primitives the rest of the app builds on, `GlassCard` (a translucent, blurred panel with a solid fallback) and `RippleButton` (tactile tap feedback), and applies them to the shell. Both respect the user's motion and transparency preferences and keep text at WCAG AA contrast.

## Scope

### In scope

1. **Design tokens:** a minimal set of colour tokens in the Tailwind `@theme` block in `src/index.css`: brand/accent, text on surfaces, glass surface (translucent), solid fallback surface, glass border, and focus ring. Existing shell styles switch to these tokens.
2. **`GlassCard`** in `src/web/ui/GlassCard.tsx`: a polymorphic panel (`as` prop limited to `'div' | 'section' | 'article' | 'header' | 'nav' | 'aside'`, default `'div'`) that forwards other props and merges `className`.
3. **Glass styling** as a single reusable utility (e.g. `@utility glass` in `index.css`): solid opaque background by default; translucent background plus `backdrop-blur` only inside `@supports (backdrop-filter: blur(1px))`, switched back to solid under `prefers-reduced-transparency: reduce`.
4. **`useRipple` hook** in `src/web/ui/useRipple.tsx`: returns a `pointerdown` handler and the ripple elements to render. On pointer down it adds a span positioned at the tap point that expands via a CSS keyframe and is removed on `animationend`. Under `prefers-reduced-motion: reduce` it creates no span.
5. **`RippleButton`** in `src/web/ui/RippleButton.tsx`: a `<button>` (default `type="button"`) built on `useRipple`, forwarding other props. It has a static, non-animated pressed state (`:active` tint) that works with or without motion.
6. **Apply to the shell:** `Header` and `BottomNav` render through `GlassCard` (as `header` and `nav`, keeping their landmarks and safe-area padding), and the bottom-nav `NavLink`s use `useRipple` plus the static pressed state.
7. **Tests:** unit tests for both primitives, the reduced-motion behaviour, and a contrast test over the design tokens.

### Out of scope (later phases)

- `FilterChips` (Phase 9) and the drawer (later phases); they will reuse `GlassCard` and `useRipple`.
- Letting the map extend under the header and nav. The shell keeps its flex layout; glass shows its full effect once there is content behind it (Phase 3 onward).
- Dark mode.
- i18n (Phase 2). The primitives contain no user-facing strings of their own.
- Accessibility test tooling such as axe-core.

## Decisions

| #   | Decision                                                                                                                                                                                                        | Rationale                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| D1  | **Build and apply to the shell** in this phase.                                                                                                                                                                 | The phase is demoable and the primitives are proven against real components.                                |
| D2  | **Pointer-positioned ripple span**, animated with a CSS keyframe and removed on `animationend`. No animation library.                                                                                           | Feedback starts at the finger; `tech-stack.md` rules out animation libraries.                               |
| D3  | **Minimal colour tokens** in `@theme`, used by the shell and primitives.                                                                                                                                        | Glass and contrast are defined once and can be tested; a later design pass changes values in one place.     |
| D4  | **Solid by default, glass by progressive enhancement:** translucency and blur only under `@supports (backdrop-filter)`, overridden back to solid under `prefers-reduced-transparency: reduce`.                  | Unsupported browsers and users who ask for less transparency get the solid, high-contrast surface.          |
| D5  | **`RippleButton` plus a `useRipple` hook.** Nav links use the hook directly rather than becoming buttons.                                                                                                       | Links stay links (correct semantics) but share the same feedback.                                           |
| D6  | **Reduced motion: no ripple span at all**, with a static `:active` pressed tint as feedback. The keyframe is also wrapped in `motion-safe:` as a second guard.                                                  | `prefers-reduced-motion` users still get feedback, with nothing moving.                                     |
| D7  | **`GlassCard` `as` prop limited to a fixed set of tags.**                                                                                                                                                       | The shell keeps its `header` and `nav` landmarks; a closed union keeps the typing simple and strict.        |
| D8  | **Ripple is decorative:** spans are `aria-hidden`, `pointer-events-none`, and clipped by the host (`relative overflow-hidden`). Keyboard activation does not ripple; the visible focus ring is the feedback.    | Ripple adds nothing for assistive tech and must never block taps or change layout.                          |
| D9  | **Contrast is tested against the tokens:** a pure `contrastRatio` helper and a test that reads the token values from `src/index.css` and checks text against the solid fallback and the worst-case glass blend. | One source of truth for colours; jsdom cannot compute real blur, so the test checks the worst case instead. |
| D10 | **No new runtime dependencies.**                                                                                                                                                                                | Bundle budget.                                                                                              |
| D11 | **One commit for the whole phase**, made at the end once `npm run ci` is green. It includes the spec and ticks the three PR-only items in `specs/2026-11-19-app-shell/validation.md`.                           | The user's preferred flow from Phase 1b onward: one reviewable commit per phase.                            |

## Constraints

- Text on every glass surface meets WCAG AA (≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI component boundaries such as the focus ring), against both the solid fallback and the worst-case glass blend.
- Nothing is conveyed by colour alone; the existing active-tab indicator stays.
- Nav tap targets stay at least 44 × 44 px; the ripple does not change layout.
- No user-facing strings are added outside `src/web/app/strings.ts`.
- The gzipped JS bundle stays well under the ~200 KB budget. Record the before/after size.
- `src/core/` is untouched by UI code (the boundary rule still passes).

## Notes

- Tests stub `window.matchMedia` per test to switch reduced motion on and off.
- `prefers-reduced-transparency` currently has limited browser support; it is applied as an override, so browsers that don't support it keep glass rather than losing it.
