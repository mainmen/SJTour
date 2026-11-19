# Phase 13: MVP Polish and Release — Requirements

- **Branch:** `feature/mvp-release`, from `main` after the Phase 12 merge (PR #8). One commit, one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 13
- **Guidance:** `specs/tech-stack.md` (performance budget, WCAG 2.1 AA, static hosting, sample data never ships), `specs/mission.md`

## Context

The MVP has all four categories, filters, search, list and detail views. Before release it needs to hold up with more data (clustering), say clearly what is happening (loading, empty), pass an accessibility review, stay within its budget, and have a way to deploy — without ever shipping placeholder data.

## Scope

### In scope

1. **Release gate** `scripts/check-release.ts` (`npm run check:release`): lists every `sample: true` record in `public/data` and fails while any remain. The deploy workflow runs it first.
2. **Marker clustering** `src/core/map/cluster.ts` (pure, tested): markers of one category that would overlap on screen (within 40 px at the current zoom) merge into a badge with the category icon and the count. Nothing clusters above zoom 15, so "Show on map" (zoom 16) always shows the place itself.
   - The badge is a button named "3 lieux, Entreprises. Zoomer pour les afficher"; a tap, Enter or Space zooms in until it splits; with the keyboard, focus then moves to the first member.
   - The selected record always has its own marker, and keeps it after its card closes until the next zoom, so focus can return to it.
3. **Map states** (one polite status under the chips): places loading; no layer on (with **Show all**); search results (Phase 12); nothing to show with the current filters (with **Show all** when some layers are off). A failed category keeps its own alert. List, events and detail pages already have their states.
4. **Accessibility pass**
   - A **skip link** ("Aller au contenu"), the first tab stop, that focuses `<main>` without changing the URL.
   - A **document title per page** ("Liste — StJeanTour"; the detail page keeps its own), following the language (WCAG 2.4.2).
   - **Focus after navigation:** when the focused element left with the old page, focus goes to `<main>`; focus a page set itself (the map card) is left alone.
   - The **About** page gets real content: purpose, data freshness, OSM credit with a link, privacy (no account, no tracking cookies).
   - Existing automated contrast, reduced-motion and keyboard tests stay green.
5. **Performance budget** `scripts/check-bundle.ts` (`npm run check:bundle`, part of `npm run ci` and the CI workflow): gzips the entry chunk, the home (map) chunk and their static imports and fails above 200 kB.
6. **Static hosting:** GitHub Pages via `.github/workflows/deploy.yml`, **manual** (`workflow_dispatch`): release check, `npm run ci`, a build with `BASE_PATH=/<repo>/`, `404.html` = `index.html` for deep links, then deploy. Vite `base` and the router `basename` follow `BASE_PATH`. README explains the steps.

### Out of scope (left to the owner)

- **Writing the real data.** Entries must be verified by a person; this phase ships the gate that blocks a release until they are in (D1).
- **Enabling Pages and running the first deploy** (repository settings, outward-facing).
- A manual screen-reader pass and real-device checks (tracked as manual boxes).

## Decisions

| #   | Decision                                                                                                                     | Rationale                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| D1  | **Gate, don't invent data:** a release check fails while `sample: true` records remain; the owner supplies verified entries. | `lastVerified` must mean a person checked it; web-scraped guesses would mislead visitors.               |
| D2  | **Own clustering in core** (greedy, pixel distance, per category), not Leaflet.markercluster.                                | ~1 kB instead of a plugin; testable and portable (specs/tech-stack.md → portable core); keeps colours.  |
| D3  | **Per-category clusters**, never across categories; none above zoom 15; the selected record is never clustered.              | A cluster keeps its category icon and colour; revealed and selected places stay visible and focusable.  |
| D4  | **One map status line** for loading, no layers, search results and empty.                                                    | One live region, one place to look; no stacked banners over the map on a phone.                         |
| D5  | **GitHub Pages, manual deploy**; sub-path through `BASE_PATH`; `404.html` fallback.                                          | Nothing publishes by accident; no server config; deep links work.                                       |
| D6  | **Bundle budget enforced in CI** on the home page's JavaScript.                                                              | The budget (~200 kB) was checked by hand per phase; now a regression fails the build.                   |
| D7  | **Marker tests use a zero cluster radius** (`vi.mock`); clustering has its own tests.                                        | Existing tests look at single markers; mixing in clustering would make them depend on sample positions. |
| D8  | **One commit for this phase.**                                                                                               | The one-commit-per-phase rule.                                                                          |
