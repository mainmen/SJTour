# Phase 8: Trails Module — Plan

The phase lands as **one commit** on `feature/trails-filters-views`. See `requirements.md` and `validation.md`.

## 1. Core utilities (tests first)

1.1 `src/core/services/geo.ts` + `geo.test.ts` (distance, path length, bounds).
1.2 `formatKm` in `src/core/services/units.ts`, tested in `format.test.ts`.

## 2. Module contract and loader

2.1 Add `fileSchema` and `extentOf` to `CoreCategoryModule`.
2.2 `validateCollection` applies `fileSchema` and reports its issues.

## 3. Trails core

3.1 `schema.ts`, `geojson.ts`, `selectors.ts`, `module.ts`; register the module.
3.2 `trails.test.ts`: schema, GeoJSON reading, layers, geometry helpers, shipped data.

## 4. Seed data

4.1 `public/data/trails.geojson` (3 sample trails).
4.2 The test helper reads `*.geojson` (as text) next to `*.json`.

## 5. Web

5.1 `OverlayProps` and an optional `Overlay` on `WebCategoryModule`; `CategoryMarkers` renders it under the markers.
5.2 `src/web/modules/trails/` (`TrailCard`, `TrailLines`, `index.ts`); register it.
5.3 Trail colour tokens, line CSS, contrast test.
5.4 `RevealSelection` fits a record's extent when shown from a list.
5.5 i18n keys.

## 6. Tests and wrap-up

6.1 `TrailCard` test (both languages); `MapPage` tests (layers, dashes, tap a line).
6.2 Tick Phase 8 in `specs/roadmap.md`; tick the PR-CI box of Phases 4–7 (PR #6 CI was green).
6.3 `npm run ci`, commit: `feat: add trails module with walking and biking layers (Phase 8)`.
