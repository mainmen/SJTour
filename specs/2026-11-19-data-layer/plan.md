# Phase 4: Core Contracts and Data Layer — Plan

This plan starts on `feature/content-modules`, branched from `main` at `ecd24fe`. The phase lands as **one commit** (D8). See `requirements.md` and `validation.md`.

## 0. Baseline

0.1 Run `npm run build` on `main` and record the gzipped JS sizes (main 97.95 kB, map chunk 45.00 kB).
0.2 Tick the PR-only boxes left open by Phases 2 and 3 now that PR #5 is merged with green CI.

## 1. Dependencies

1.1 Install `zod` and `zustand`.

## 2. Shared types (types first)

2.1 Add `src/core/types/`: `bilingual.ts` (`BilingualText`, `pickText`), `geo.ts` (`LatLng`, `LatLngBounds`, moved from the map config, which re-exports them), `category.ts` (`CategoryId`, `CATEGORY_IDS`), `module.ts` (`CoreCategoryModule`, `CategoryPresentation`) and an `index.ts` barrel.
2.2 Test `pickText` for both languages.

## 3. Base schema

3.1 Add `src/core/schemas/base.ts`: `slugSchema`, `bilingualTextSchema`, `coordinatesSchema`, `isoDateSchema`, `baseRecordShape`, `defineRecordSchema`.
3.2 Write `base.test.ts`: a valid record passes; each of these fails: bad slug, empty or whitespace-only `fr`/`en`, missing language, coordinates outside the bounds or swapped, impossible date (`2026-02-30`), non-`https` website, unknown key, wrong category literal.

## 4. Loader

4.1 Add `src/core/services/loader.ts`: `JsonSource`, `LoadError`, `LoadResult`, `validateCollection`, `loadCollection`, `excludeSamples`.
4.2 Write `loader.test.ts` with a fake source: success, the source rejects (`unavailable`), the data is not an array or a record is invalid (`invalid`, with issue paths), duplicate ids (`invalid`), and `includeSamples: false` drops sample records.
4.3 Add `src/web/adapters/jsonSource.ts` (`fetch`, throws on non-2xx) with a test using a stubbed `fetch`.

## 5. Stores

5.1 Add `src/core/store/selection.ts`, `language.ts` and `catalog.ts`, each a `createXStore()` factory using `zustand/vanilla`.
5.2 Write a test per store: initial state, every action, and for the catalog: loading → success, loading → error, de-duplication of concurrent loads, `reload` after an error, independent categories.
5.3 Add `src/web/state/stores.ts`: the app's store instances, a `useAppStore(store, selector)` hook, and the i18next → language store sync.

## 6. Build-time data check

6.1 Add `src/core/modules/registry.ts` (empty list until Phase 5) and `data-files.test.ts`, which loads `public/data/<module.dataFile>` with `import.meta.glob` and runs `validateCollection`.

## 7. Wrap-up

7.1 Work through `validation.md`.
7.2 Tick off Phase 4 in `specs/roadmap.md`.
7.3 Run `npm run ci`, then commit: `feat: add core contracts, base schema, loader and stores (Phase 4)`.
