# Phase 4: Core Contracts and Data Layer — Validation

The Phase 4 commit (and the combined Phase 4–7 PR) on `feature/content-modules` can merge only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [x] `npm run format:check`
- [x] `npm run lint`: 0 errors, 0 warnings (including the core boundary rule)
- [x] `npm run typecheck`
- [x] `npm run test`: all tests pass
- [x] `npm run build`: no errors or warnings
- [ ] The CI run on the pull request is green

## 2. Types and contract

- [x] `BilingualText`, `LatLng`, `CategoryId`, `BaseRecord` and both sides of the `CategoryModule` contract live in `src/core/types/`
- [x] Record types are inferred from Zod schemas, not written by hand
- [x] `src/core/map/config.ts` still exports `LatLng` and its tests pass unchanged

## 3. Base schema

- [x] Test: a complete valid record passes
- [x] Test: each invalid case in plan 3.2 is rejected, with an issue path pointing at the bad field

## 4. Loader

- [x] Test: success returns the parsed records
- [x] Test: a throwing source gives `error.kind === 'unavailable'` and the loader does not throw
- [x] Test: invalid data and duplicate ids give `error.kind === 'invalid'` with issues
- [x] Test: `includeSamples: false` drops `sample: true` records
- [x] Test: the `fetch` adapter throws on a non-2xx response

## 5. Stores

- [x] Test: selection select/clear, with `origin`
- [x] Test: language defaults to `fr` and follows i18next
- [x] Test: catalog loading/success/error per category, de-duplicated loads, reload after error
- [x] Core stores import `zustand/vanilla` only

## 6. Scope and hygiene

- [x] The only new dependencies are `zod` and `zustand`
- [x] `src/core/` imports no React, React DOM, Leaflet or i18next, and uses no browser globals
- [x] No visible UI change in this phase (main chunk 97.95 → 98.68 kB gzipped: zustand and the stores; Zod is not in it)
- [x] The phase is a single commit with a conventional commit message
- [x] Phase 4 is checked off in `specs/roadmap.md`
