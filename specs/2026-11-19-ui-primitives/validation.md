# Phase 1b: UI Primitives — Validation

The branch `feature/ui-primitives` can merge only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [x] `npm run format:check`
- [x] `npm run lint`: 0 errors, 0 warnings
- [x] `npm run typecheck`
- [x] `npm run test`: all tests pass, including the reduced-motion and contrast tests
- [x] `npm run build`: no errors or warnings
- [x] `npm run ci` passes locally from a clean install
- [x] The CI run on the pull request is green (PR #4, merged 2026-11-19)

## 2. Primitives

- [x] `GlassCard` and `RippleButton` live in `src/web/ui/`, with `useRipple` and the contrast helper alongside
- [x] `GlassCard` renders a `div` by default and the requested tag for each allowed `as` value; `className` merges and other props are forwarded
- [x] `RippleButton` defaults to `type="button"` and calls the caller's `onPointerDown` and `onClick`
- [x] Glass styling comes from one shared `glass` utility, not repeated class lists

## 3. Reduced motion

- [x] Test: with `prefers-reduced-motion: reduce`, pointer down creates **no** ripple span
- [x] Test: without it, pointer down creates exactly one ripple span, removed after `animationend`
- [x] The ripple keyframe is also guarded by `motion-safe:` (CSS check)
- [ ] Manual: devtools → Rendering → emulate `prefers-reduced-motion: reduce`; tapping a nav item shows the static pressed tint and no animation (pending: needs an interactive browser; the unit tests cover the behaviour)

## 4. Contrast and transparency

- [x] `tokens.node.test.ts` reads the token values from `src/index.css` (no duplicated colour values)
- [x] Text ≥ 4.5:1 on the solid fallback surface
- [x] Text ≥ 4.5:1 on the glass surface blended over both white and black backdrops
- [x] Focus ring ≥ 3:1 against the surfaces it sits on
- [ ] Manual: devtools → Rendering → emulate `prefers-reduced-transparency: reduce` (where supported) or disable `backdrop-filter`; header and nav show the solid fallback (pending: needs an interactive browser; compiled CSS checked: solid default, glass only under `@supports`, solid again under reduced transparency)
- [ ] Manual: the devtools contrast picker on the header title and nav labels reports AA (pending: needs an interactive browser; `tokens.node.test.ts` checks the worst case)

## 5. Shell integration

- [x] `Header` renders through `GlassCard as="header"` and `BottomNav` through `GlassCard as="nav"`; the `banner` and labeled `navigation` landmarks are unchanged
- [x] Phase 1 layout and routing tests pass without changes to their assertions (new tests were only added)
- [x] Nav links show a ripple on tap (motion allowed) and keep the active indicator, `aria-current` and focus ring
- [x] Ripple spans are `aria-hidden` and `pointer-events-none`, and do not cause layout shift or overflow
- [x] Nav tap targets are still at least 44 × 44 px
- [x] Keyboard activation works and does not need the ripple

## 6. Manual mobile check (dev server)

Run `npm run dev` and check in browser devtools:

- [ ] **360 × 640:** no horizontal or page-level vertical scroll; ripple stays clipped inside the tapped item (layout verified in headless Edge inside a 360 × 640 iframe; ripple clipping on a real tap still to check)
- [x] **Desktop (1280 × 800):** glass header and nav render correctly
- [ ] **iPhone with notch (devtools preset):** safe-area padding still applies to the glass header and nav (pending: safe-area classes are unchanged from Phase 1; re-check with the devtools preset)
- [x] The browser console shows no errors or warnings (headless Edge on the production preview)

## 7. Bundle size

- [x] The baseline gzipped JS size (before this phase) and the new size are both recorded in the PR description (78.42 kB → 78.88 kB gzipped)
- [x] The new size is well under the ~200 KB gzipped budget

## 8. Scope and hygiene

- [x] No new runtime dependencies
- [x] No hard-coded user-facing strings outside `src/web/app/strings.ts`
- [x] No FilterChips, drawer, i18n, map or data code (later phases)
- [x] The three PR-only items in `specs/2026-11-19-app-shell/validation.md` are ticked
- [x] The phase is a single commit with a conventional commit message
- [x] Phase 1b is checked off in `specs/roadmap.md`
