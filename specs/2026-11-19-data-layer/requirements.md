# Phase 4: Core Contracts and Data Layer — Requirements

- **Branch:** `feature/content-modules` (based on `main` after Phases 2 and 3 merged in PR #5). This branch is shared with Phases 5, 6 and 7. Each phase gets its own commit, and all four go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 4
- **Guidance:** `specs/tech-stack.md` (Architecture, Data model principles, State, Validation), `specs/mission.md` (principles 3, 6, 9, 10)

## Context

The app has a shell, i18n and a base map, but no content. Before any category ships, this phase defines what every category shares: the record types, the base Zod schema, the `CategoryModule` contract, a generic JSON loader with error states, and the Zustand stores. Everything here is pure core code with unit tests (spec-driven order: types and tests first). The UI arrives in Phase 5.

## Scope

### In scope

1. **Dependencies:** `zod` (v4) and `zustand` (v5). No other runtime dependencies.
2. **Shared types** in `src/core/types/`:
   - `BilingualText = { fr: string; en: string }` and `pickText(text, language)`.
   - `LatLng` moves here (re-exported by `src/core/map/config.ts`, which keeps working unchanged).
   - `CategoryId = 'companies' | 'activities' | 'events' | 'trails'` and `CATEGORY_IDS`.
   - `BaseRecord`, inferred from the base schema.
   - The `CategoryModule` contract, both sides (D2):
     - `CoreCategoryModule<T>`: `id`, `dataFile` (path under `public/`), `recordSchema` and an optional `visibleOnMap(records, now)` selector.
     - `CategoryPresentation<T, C>`: `id`, `labelKey`, `Icon`, `tone` (marker style) and `Card`, generic over the component type `C` so core never imports React. The web layer fixes `C` to a React component type.
3. **Base Zod schema** in `src/core/schemas/base.ts`:
   - `id`: a lower-case slug (`a-z`, `0-9`, `-`).
   - `category`: one of `CategoryId`.
   - `name` and `description`: bilingual, both languages non-empty after trimming.
   - `coordinates`: `[lat, lng]`, finite, and inside the map's `MAX_BOUNDS` (this also catches swapped lat/lng).
   - `lastVerified`: an ISO calendar date (`YYYY-MM-DD`).
   - `sample`: optional boolean.
   - `address` (optional, one string: street addresses are not translated) and `website` (optional `https://` URL).
   - Objects are strict: unknown keys are rejected, so typos in data files fail validation.
   - A `defineRecordSchema(category, extraShape)` helper builds a category schema from the base, with `category` fixed to a literal.
4. **Generic loader** in `src/core/services/loader.ts`:
   - `JsonSource` adapter interface: `getJson(path): Promise<unknown>`. The browser implementation (`fetch`) lives in `src/web/adapters/jsonSource.ts`.
   - `loadCollection(source, module, options)` returns a `LoadResult<T>`: `{ status: 'success', records }` or `{ status: 'error', error }`, where `error.kind` is `'unavailable'` (the source threw: network, HTTP or JSON syntax) or `'invalid'` (Zod issues, or duplicate ids). It never throws.
   - `options.includeSamples` (D4): when `false`, records with `sample: true` are dropped after validation.
   - `validateCollection(module, data)` is the pure, synchronous part, reused by the build-time data test.
5. **Zustand stores** in `src/core/store/`, built with `zustand/vanilla` (no React in core, D3):
   - `selection`: `selected: { category, id, origin } | null`, `select(ref)`, `clear()`. `origin` is `'map'` or `'list'` (a list "Show on map" asks the map to zoom to the item).
   - `language`: `language`, `setLanguage(lang)`, defaulting to French. The web i18n setup keeps it in sync with i18next.
   - `catalog`: per category, `{ status: 'idle' | 'loading' | 'success' | 'error', records, error }` and `load(module)`, which skips a category that is loading or loaded unless forced (`reload`). Built by `createCatalogStore(source, options)` so tests inject a fake source.
6. **Web glue (no visible UI yet):** the `fetch` JSON source adapter, the language store sync, and a `useStore` binding (`src/web/state/stores.ts`) that creates the app's store instances.
7. **Build-time data check:** `src/core/modules/data-files.test.ts` loads every `public/data/*.json` file (Vite `import.meta.glob`) and validates it with its module (Phase 5 adds the first file; until then the test checks that every registered module has a file).
8. **Tests:** unit tests for `pickText`, the base schema (valid record, every rejected case), the loader (success, source throws, invalid data, duplicate ids, sample filtering) and every store action.

### Out of scope (later phases)

- Category schemas, data files and markers (Phases 5–7).
- Trails and GeoJSON (Phase 8).
- The filter store and URL mirroring (Phase 9).
- The release check that fails when `sample: true` records ship (Phase 13).

## Decisions

| #   | Decision                                                                                                                                                                                                         | Rationale                                                                                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| D1  | **Zod 4 and Zustand 5.** Schemas are the single source of truth; record types are `z.infer`'d from them.                                                                                                         | Matches `tech-stack.md`. No hand-written type can drift from validation.                                              |
| D2  | **The web side of the contract is typed in core but generic over the component type** (`CategoryPresentation<T, C>`). `src/web/modules/types.ts` sets `C = ComponentType<CardProps<T>>`.                         | The roadmap puts both sides in `src/core/types/`, and the core must not import React.                                 |
| D3  | **Core stores use `zustand/vanilla`**; React binds to them in `src/web/` with `useStore`.                                                                                                                        | `zustand/vanilla` has no React dependency, so the stores stay portable (principle 10).                                |
| D4  | **Sample records are kept by default** (`includeSamples: true`) until Phase 13, when real data replaces them and the release check is added. Sample records always show a visible "Sample data" badge in the UI. | All development data is sample data; hiding it would leave the map empty. The badge keeps it flagged (principle 3).   |
| D5  | **Data files live in `public/data/`** and are fetched at runtime from `import.meta.env.BASE_URL + 'data/…'`.                                                                                                     | The file layout in `tech-stack.md`; content can change without a rebuild, and the later CMS sits behind `JsonSource`. |
| D6  | **Coordinates must fall inside `MAX_BOUNDS`.**                                                                                                                                                                   | Content is local-only (non-goal: other areas). It also catches swapped `[lng, lat]` pairs.                            |
| D7  | **Errors are values, not exceptions.** The loader returns a discriminated union, and the catalog store keeps `status` and `error` per category, so one broken file never blanks the others.                      | Error states are part of the contract and easy to test.                                                               |
| D8  | **One commit for this phase**, made once `npm run ci` is green. The four phases share one PR.                                                                                                                    | The one-commit-per-phase rule.                                                                                        |

## Constraints

- `src/core/` imports nothing from React, React DOM, Leaflet, i18next or `src/web/`, and uses no browser globals (the boundary lint rule).
- Every service and store in `src/core/` has unit tests.
- The main (non-lazy) chunk grows only by what the shell needs; Zod loads with the map and events chunks.
