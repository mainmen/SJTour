# Phase 1b: UI Primitives — Plan

Each task group ends with every check passing (`npm run ci`), but nothing is committed until the end: the whole phase lands as **one commit** (decision D11). See `requirements.md` for scope and decisions and `validation.md` for the merge criteria.

## 0. Baseline

0.1 Run `npm run build` on the branch start point and record the gzipped JS size (for the bundle comparison in `validation.md`).

## 1. Spec and Phase 1 follow-ups

1.1 Add this spec (`specs/2026-11-19-ui-primitives/`).
1.2 Tick the three PR-only items in `specs/2026-11-19-app-shell/validation.md` (CI green on PR #3, bundle sizes in the PR description, SPA-fallback note).

## 2. Design tokens and contrast test

2.1 Add colour tokens to `@theme` in `src/index.css` (D3): accent, text, glass surface (with alpha), solid fallback surface, glass border, focus ring.
2.2 Add the `glass` utility (D4): solid fallback background by default; translucent background and `backdrop-blur` inside `@supports (backdrop-filter: blur(1px))`, reverted to the solid surface inside `@media (prefers-reduced-transparency: reduce)`. (An override rather than `@media not (…)`: browsers that don't know the media feature, such as Safari, would otherwise never get glass.)
2.3 Add a pure `contrastRatio(fg, bg)` helper (WCAG relative luminance) and an alpha-blend helper in `src/web/ui/contrast.ts`.
2.4 Write `src/web/ui/contrast.test.ts` for the helpers (known values, e.g. black on white = 21) and `src/web/ui/tokens.node.test.ts` (D9). The token test runs in the Node environment and reads `src/index.css` from disk (Vitest stubs CSS imports, so `?raw` is empty); `*.node.test.ts` files are type-checked by `tsconfig.node.json`, like `*.lint.test.ts`. It asserts text ≥ 4.5:1 on the solid fallback and on the glass surface blended over the worst-case backdrop (white and black), and the focus ring ≥ 3:1.
2.5 Switch `Header` and `BottomNav` from hard-coded `sky`/`slate` colours to the tokens (no visual redesign yet).

## 3. GlassCard

3.1 Build `src/web/ui/GlassCard.tsx` (D7): `as` prop over the fixed tag union (default `div`), applies the `glass` utility plus the glass border, merges `className`, forwards other props.
3.2 Write tests: renders a `div` by default; `as="nav"` with `aria-label` produces a navigation landmark; `className` is merged; children and props are forwarded.

## 4. Ripple

4.1 Add the ripple keyframe and classes to `src/index.css` (expanding, fading circle; `motion-safe:` guard) (D2, D6).
4.2 Build `src/web/ui/useRipple.tsx` (it renders the ripple spans, so it is a `.tsx` file): checks `matchMedia('(prefers-reduced-motion: reduce)')` at pointer down; when motion is allowed, adds `{ id, x, y, size }` to state and renders an `aria-hidden`, `pointer-events-none` span; removes it on `animationend` (D8).
4.3 Build `src/web/ui/RippleButton.tsx` (D5): `<button type="button">` by default, `relative overflow-hidden`, static `:active` tint, calls any `onPointerDown` the caller passes as well as the ripple handler.
4.4 Add a `matchMedia` stub helper for tests (`src/test/matchMedia.ts`), and polyfill `AnimationEvent` in `src/test/setup.ts`: without it, React in jsdom listens for `webkitAnimationEnd` instead of `animationend`.
4.5 Write tests:

- motion allowed: pointer down adds one ripple span, which is removed after `animationend`;
- **reduced motion: pointer down adds no ripple span** (roadmap requirement);
- the caller's `onPointerDown` and `onClick` still fire; `type` defaults to `button`;
- ripple spans are `aria-hidden`.

## 5. Apply to the shell

5.1 Render `Header` through `GlassCard as="header"`, keeping the `h1` and top safe-area padding.
5.2 Render `BottomNav` through `GlassCard as="nav"` with its `aria-label`, keeping bottom safe-area padding.
5.3 Add `useRipple` and the static pressed tint to each `NavLink` (one hook per item, e.g. a small `NavItem` component); keep the 44 × 44 px target and active indicator.
5.4 Make sure the existing layout and routing tests still pass unchanged; add a test that a nav link shows a ripple on pointer down (motion allowed).

## 6. Wrap-up

6.1 Run `npm run build` and record the new gzipped JS size next to the baseline.
6.2 Work through every item in `validation.md`.
6.3 Tick off Phase 1b in `specs/roadmap.md`.
6.4 Run `npm run ci` once more, then make the single phase commit: `feat: add GlassCard and RippleButton UI primitives (Phase 1b)`.
