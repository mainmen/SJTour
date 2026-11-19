# Phase 1: App Shell — Requirements

- **Branch:** `feature/app-shell` (based on `main` after Phase 0 merged in PR #2)
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 1
- **Guidance:** `specs/mission.md` and `specs/tech-stack.md`

## Context

Phase 0 delivered a strict, linted, tested Vite + React 18 + Tailwind v4 skeleton with CI. The app is still a single placeholder heading in `src/App.tsx`.

This phase builds the frame every later feature lives in: the two-layer architecture (`src/core/` for portable logic, `src/web/` for presentation), a lint rule that keeps those layers apart, a mobile-first layout (header, full-screen content area, bottom nav), and client-side routing with placeholder pages. The map arrives in Phase 3, so the content area in this phase holds placeholders only.

## Scope

### In scope

1. **Layer folders:** create `src/core/` and `src/web/` following the tree in `tech-stack.md` → Architecture. Only create the folders this phase needs (`src/core/` with an index, `src/web/app/`); later phases add the rest.
2. **Boundary rule:** an ESLint rule scoped to `src/core/**` that forbids importing:
   - anything from `src/web/` (via `@/web/...` or relative paths),
   - `react-dom` and its subpaths, `leaflet`, `react-leaflet`,
   - browser globals: `window`, `document`, `localStorage`, `sessionStorage`, `navigator`, `location`.
3. **Move the app:** move `App.tsx` and its test into `src/web/app/`, and update `main.tsx`.
4. **Layout:** a mobile-first shell with
   - a header showing the app name,
   - a full-height content area (`<main>`) that fills the space between header and nav, ready to host a full-screen map,
   - a bottom nav with three items (Carte `/`, Liste `/list`, À propos `/about`), each with a Lucide icon and a visible text label.
5. **Routing:** React Router (v7, library mode) with `createBrowserRouter` and the routes `/`, `/list` and `/about`, each rendering a placeholder page. Unknown paths render a simple "page not found" placeholder.
6. **Strings:** all shell labels live in one constants file, `src/web/app/strings.ts`, in French.
7. **Tests:** RTL tests for the layout, routes and nav, plus a test proving the boundary rule fires.

### Out of scope (later phases)

- `GlassCard`, `RippleButton` and glass/ripple styling (Phase 1b). The header and nav use plain solid Tailwind styling for now.
- i18n, English strings and the language toggle (Phase 2)
- Leaflet and the map (Phase 3)
- Types, Zod, Zustand and data loading (Phase 4)
- Detail routes such as `/:category/:id` (Phase 10)
- SPA-fallback configuration for a specific host (Phase 13, deployment)

## Decisions

| #   | Decision                                                                                                                                                                    | Rationale                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Phase 1 only.** Phase 1b stays a separate phase.                                                                                                                          | Keeps the phase small and reviewable, per the roadmap.                                                                           |
| D2  | **History-based routing** with `createBrowserRouter` (`react-router` v7, library mode, no framework/SSR mode).                                                              | Clean, shareable URLs, which matter for deep links (Phase 10) and filter query params (Phase 9).                                 |
| D3  | The chosen host must serve `index.html` for unknown paths. This is recorded now and configured at deployment (Phase 13).                                                    | History routing needs an SPA fallback. Netlify/Vercel support this with a one-line config; GitHub Pages needs a `404.html` copy. |
| D4  | **Move `App` into `src/web/app/`.** `src/main.tsx` stays at the root as the Vite entry and imports from `@/web/app/`.                                                       | Everything React lives in the web layer, per the architecture.                                                                   |
| D5  | **Central strings file** `src/web/app/strings.ts` (a typed `as const` object, French only).                                                                                 | Avoids scattering hard-coded strings. Phase 2 replaces it with i18n keys in one place.                                           |
| D6  | **Boundary enforced with built-in ESLint rules**: `no-restricted-imports` (paths and patterns) and `no-restricted-globals`, in a config block scoped to `src/core/**/*.ts`. | No extra plugin, matches `tech-stack.md`.                                                                                        |
| D7  | **Lucide icons imported per icon** (e.g. `import { Map } from 'lucide-react'`). Icons are decorative (`aria-hidden`); the text label gives the accessible name.             | Tree-shaking for the bundle budget; WCAG — nothing conveyed by icon alone.                                                       |
| D8  | **Bottom nav uses `NavLink`**, so the active item gets `aria-current="page"` and a visible non-color indicator (e.g. weight or underline) as well as a color change.        | Accessibility: nothing conveyed by color alone.                                                                                  |
| D9  | **Safe-area insets** respected (`viewport-fit=cover` plus `env(safe-area-inset-*)` padding on header and nav). Use `100dvh` for the shell height.                           | Phones with notches and home indicators; mobile browser toolbars.                                                                |
| D10 | Layout uses a `<header>`, `<main>` and `<nav aria-label="…">` landmark structure. The nav is visible at all widths in this phase; a desktop-specific layout can come later. | Screen-reader landmarks; keep the phase small.                                                                                   |
| D11 | **One commit per task group** in `plan.md`, each leaving the repo green.                                                                                                    | Same as Phase 0.                                                                                                                 |

## New runtime dependencies

| Package        | Purpose            |
| -------------- | ------------------ |
| `react-router` | Client-side routes |
| `lucide-react` | Nav icons          |

No other runtime dependencies are added.

## Constraints

- `src/core/` contains no React, DOM, Leaflet or browser-global code, and lint proves it.
- No hard-coded user-facing strings outside `strings.ts`.
- Tap targets in the nav are at least 44 × 44 px.
- The gzipped JS bundle stays well under the ~200 KB budget. Record the before/after size.
- No API keys, analytics or tracking.

## Notes

- Phase 0's App smoke test is replaced by layout tests that cover the same heading.
- Tests that render routes use `createMemoryRouter` with the same route config as the app, so the route table is defined once (e.g. exported from `src/web/app/routes.ts`).
