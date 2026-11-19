# Phase 1: App Shell — Validation

The branch `feature/app-shell` can merge only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [ ] `npm run format:check`
- [ ] `npm run lint`: 0 errors, 0 warnings
- [ ] `npm run typecheck`
- [ ] `npm run test`: all tests pass, including the boundary and routing tests
- [ ] `npm run build`: no errors or warnings
- [ ] `npm run ci` passes, and the CI run on the pull request is green

## 2. Layer structure

- [ ] `src/core/` and `src/web/` exist; `App` lives in `src/web/app/`
- [ ] `src/main.tsx` is the only React file outside `src/web/`
- [ ] `src/core/` has no imports of `react-dom`, `leaflet`, `react-leaflet` or `@/web` (`grep -r` returns nothing)

## 3. Boundary rule

- [ ] `src/core/boundary.lint.test.ts` asserts that each of these fails lint in a `src/core/` file:
  - `import { createRoot } from 'react-dom/client'`
  - `import L from 'leaflet'` and `import { MapContainer } from 'react-leaflet'`
  - `import { App } from '@/web/app/App'` and a relative import into `web`
  - use of `window`, `document`, `localStorage`, `sessionStorage`, `navigator` and `location`
- [ ] The same test asserts that a clean pure-TypeScript file passes
- [ ] Manual check, once: add `const w = window` to `src/core/index.ts`, confirm `npm run lint` fails with the adapter message, then revert
- [ ] The rule does **not** fire for the same code in `src/web/`

## 4. Routing and navigation (RTL tests)

- [ ] `/`, `/list` and `/about` each render their placeholder heading
- [ ] An unknown path renders the not-found page
- [ ] Clicking each bottom-nav link navigates to the matching page
- [ ] The active link has `aria-current="page"`; inactive links do not
- [ ] The route table is defined once in `routes.tsx` and shared by the app and the tests

## 5. Accessibility

- [ ] The page has `header`, `main` and a labeled `navigation` landmark
- [ ] Each nav link has an accessible name from its text label; icons are `aria-hidden`
- [ ] The active tab is distinguished by more than color alone
- [ ] Nav links are reachable and operable by keyboard, with a visible focus ring
- [ ] Nav tap targets are at least 44 × 44 px

## 6. Manual mobile check (dev server)

Run `npm run dev` and check in browser devtools:

- [ ] **360 × 640:** no horizontal scroll, no page-level vertical scroll; the header is at the top, the nav at the bottom, and the content area fills the space between
- [ ] **Desktop (1280 × 800):** the layout still works, with no stretched or broken nav
- [ ] **iPhone with notch (devtools preset):** header and nav are not hidden under the notch or home indicator (`viewport-fit=cover` and safe-area padding)
- [ ] Navigating between tabs updates the URL (`/list`, `/about`) without a full page reload
- [ ] Reloading `/list` on the dev server renders the list page
- [ ] The browser console shows no errors or warnings

## 7. Bundle size

- [ ] The baseline gzipped JS size (before this phase) and the new size are both recorded in the PR description
- [ ] The new size is well under the ~200 KB gzipped budget
- [ ] Only the three used Lucide icons end up in the bundle (no full icon set)

## 8. Scope and hygiene

- [ ] The only new runtime dependencies are `react-router` and `lucide-react`
- [ ] No hard-coded user-facing strings outside `src/web/app/strings.ts`
- [ ] No glass/ripple components, i18n, map or data code (later phases)
- [ ] The PR description notes that the production host needs an SPA fallback (D3)
- [ ] One commit per task group in `plan.md`, with conventional commit messages
- [ ] Phase 1 is checked off in `specs/roadmap.md`
