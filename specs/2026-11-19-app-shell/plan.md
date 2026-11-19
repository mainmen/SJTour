# Phase 1: App Shell — Plan

Each task group ends with every check passing (`npm run ci`), followed by one commit (decision D11). See `requirements.md` for scope and decisions and `validation.md` for the merge criteria.

## 0. Baseline

0.1 Run `npm run build` on the branch start point and record the gzipped JS size (for the bundle comparison in `validation.md`).

## 1. Layer folders and move the app

1.1 Create `src/core/index.ts` (an empty barrel with a comment describing the layer's rules).
1.2 Create `src/web/app/` and move `App.tsx` and `App.test.tsx` into it (`git mv`, to keep history).
1.3 Update `src/main.tsx` to import `App` from `@/web/app/App`.
1.4 Confirm the smoke test still passes through the `@/` alias.
1.5 **Commit:** `refactor: create core and web layers and move App into web/app`

## 2. Core boundary lint rule

2.1 Add an ESLint config block scoped to `src/core/**/*.ts` (D6):

- `no-restricted-imports` with `paths` for `react-dom`, `leaflet`, `react-leaflet`, and `patterns` for `react-dom/*`, `@/web`, `@/web/*` and relative paths into `web` (e.g. `**/web/**`).
- `no-restricted-globals` for `window`, `document`, `localStorage`, `sessionStorage`, `navigator` and `location`, each with a message pointing to the adapter pattern.

2.2 Write `src/core/boundary.lint.test.ts`: use ESLint's Node API (`new ESLint().lintText(code, { filePath: 'src/core/__fixture__.ts' })`) to assert that each forbidden import and global produces an error, and that a clean file produces none.
2.3 Make sure the test file itself is not flagged (it lives in `core` but only uses Node APIs — adjust the scope or add a `files`/`ignores` exception for `*.lint.test.ts` if needed).
2.4 **Commit:** `chore: enforce core/web boundary with ESLint`

## 3. Strings and layout

3.1 Install `lucide-react`.
3.2 Create `src/web/app/strings.ts`: app name, nav labels (Carte, Liste, À propos), nav landmark label, placeholder page titles and the not-found message (D5).
3.3 Update `index.html` viewport meta to include `viewport-fit=cover` (D9).
3.4 Build `src/web/app/Header.tsx`: a `<header>` with the app name as the `<h1>`, top safe-area padding.
3.5 Build `src/web/app/BottomNav.tsx`: a `<nav aria-label>` with three items, each a Lucide icon (`aria-hidden`) plus a text label, at least 44 × 44 px, bottom safe-area padding (D7, D10). Use plain links for now; task group 4 switches them to `NavLink`.
3.6 Build `src/web/app/AppLayout.tsx`: a `100dvh` flex column of header, a `flex-1 min-h-0` `<main>` and the bottom nav, with no page-level scroll (D9).
3.7 Write tests: the layout renders the header heading, a `main` landmark and a navigation landmark with three labeled links.
3.8 **Commit:** `feat: add mobile-first app layout with header and bottom nav`

## 4. Routing

4.1 Install `react-router` (v7).
4.2 Create placeholder pages in `src/web/app/pages/`: `MapPage`, `ListPage`, `AboutPage` and `NotFoundPage`, each with a heading from `strings.ts`.
4.3 Create `src/web/app/routes.tsx` exporting the route objects: `AppLayout` as the root element with an `<Outlet />` in `<main>`, children `/` (index), `/list` and `/about`, and `*` for not-found.
4.4 Switch `BottomNav` to `NavLink` with `end` on `/`; style the active item with a color change **and** a non-color indicator (D8).
4.5 Replace `App.tsx` with a `RouterProvider` using `createBrowserRouter(routes)`. Remove the old smoke test or fold it into the layout tests.
4.6 Write tests with `createMemoryRouter(routes, { initialEntries })`:

- each path renders its placeholder heading,
- an unknown path renders the not-found page,
- clicking each nav link navigates to its page (`user-event`),
- the active link has `aria-current="page"` and the others don't.

4.7 **Commit:** `feat: add React Router with placeholder routes`

## 5. Wrap-up

5.1 Run `npm run build` and record the new gzipped JS size next to the baseline.
5.2 Work through every item in `validation.md`.
5.3 Tick off Phase 1 in `specs/roadmap.md`.
5.4 **Commit:** `docs: mark Phase 1 complete in roadmap`
