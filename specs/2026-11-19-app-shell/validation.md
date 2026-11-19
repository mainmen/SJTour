# Phase 1: App Shell — Validation

The branch `feature/app-shell` can merge only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [x] `npm run format:check`
- [x] `npm run lint`: 0 errors, 0 warnings
- [x] `npm run typecheck`
- [x] `npm run test`: all tests pass, including the boundary and routing tests
- [x] `npm run build`: no errors or warnings
- [x] `npm run ci` passes locally from a clean install
- [x] The CI run on the pull request is green (PR #3)

## 2. Layer structure

- [x] `src/core/` and `src/web/` exist; `App` lives in `src/web/app/`
- [x] `src/main.tsx` is the only React file outside `src/web/`
- [x] `src/core/` has no imports of `react-dom`, `leaflet`, `react-leaflet` or `@/web` (`grep -r` returns nothing)

## 3. Boundary rule

- [x] `src/core/boundary.lint.test.ts` asserts that each of these fails lint in a `src/core/` file:
  - `import { createRoot } from 'react-dom/client'`
  - `import L from 'leaflet'` and `import { MapContainer } from 'react-leaflet'`
  - `import { App } from '@/web/app/App'` and a relative import into `web`
  - use of `window`, `document`, `localStorage`, `sessionStorage`, `navigator` and `location`
- [x] The same test asserts that a clean pure-TypeScript file passes
- [x] Manual check, once: add `const w = window` to `src/core/index.ts`, confirm `npm run lint` fails with the adapter message, then revert
- [x] The rule does **not** fire for the same code in `src/web/`

## 4. Routing and navigation (RTL tests)

- [x] `/`, `/list` and `/about` each render their placeholder heading
- [x] An unknown path renders the not-found page
- [x] Clicking each bottom-nav link navigates to the matching page
- [x] The active link has `aria-current="page"`; inactive links do not
- [x] The route table is defined once in `routes.ts` and shared by the app and the tests

## 5. Accessibility

- [x] The page has `header`, `main` and a labeled `navigation` landmark
- [x] Each nav link has an accessible name from its text label; icons are `aria-hidden`
- [x] The active tab is distinguished by more than color alone
- [x] Nav links are reachable and operable by keyboard, with a visible focus ring
- [x] Nav tap targets are at least 44 × 44 px

## 6. Manual mobile check (dev server)

Run `npm run dev` and check in browser devtools:

- [x] **360 × 640:** no horizontal scroll, no page-level vertical scroll; the header is at the top, the nav at the bottom, and the content area fills the space between
- [x] **Desktop (1280 × 800):** the layout still works, with no stretched or broken nav
- [x] **iPhone with notch (devtools preset):** header and nav are not hidden under the notch or home indicator (`viewport-fit=cover` and safe-area padding). Verified in headless Edge with the iPhone 13 preset; headless emulation reports zero safe-area insets, so re-check on a real device or the iOS simulator before release.
- [x] Navigating between tabs updates the URL (`/list`, `/about`) without a full page reload
- [x] Reloading `/list` on the dev server renders the list page
- [x] The browser console shows no errors or warnings

## 7. Bundle size

- [x] The baseline gzipped JS size (before this phase) and the new size are both recorded in the PR description (PR #3: 45.77 kB → 78.42 kB gzipped, of which lucide-react ≈ 2.5 kB and react-router ≈ 30 kB)
- [x] The new size is well under the ~200 KB gzipped budget
- [x] Only the three used Lucide icons end up in the bundle (no full icon set)

## 8. Scope and hygiene

- [x] The only new runtime dependencies are `react-router` and `lucide-react`
- [x] No hard-coded user-facing strings outside `src/web/app/strings.ts`
- [x] No glass/ripple components, i18n, map or data code (later phases)
- [x] The PR description notes that the production host needs an SPA fallback (D3, PR #3)
- [x] One commit per task group in `plan.md`, with conventional commit messages
- [x] Phase 1 is checked off in `specs/roadmap.md`
