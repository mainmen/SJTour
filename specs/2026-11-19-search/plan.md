# Phase 12: Search — Plan

This plan starts from `main` after the Phase 8–11 merge. The phase lands as **one commit**. See `requirements.md` and `validation.md`.

## 1. Core (tests first)

1.1 `src/core/search/text.ts`: `normalizeSearchText`, `searchTokens`, `matchesSearch`, `searchRecords`; `search.test.ts`.
1.2 Filter store: `query`, `setQuery`, `clearQuery`; tests.
1.3 Selectors: `query` argument on `visibleRecords`; `isRecordShown`; tests.
1.4 URL: `SEARCH_PARAM`, `parseSearchParam`, `serializeSearch`, `MAX_QUERY_LENGTH`; tests.

## 2. Web

2.1 `useFilterUrlSync` mirrors `q` (ignoring its own echoes).
2.2 `SearchBox` (bound to the store).
2.3 Map: search box above the chips, markers follow the query, result status with a link to the list, card closes when its record is searched away.
2.4 List: search box, filtered sections, no-results state with Clear search.
2.5 `useShowOnMap` clears a search the record doesn't match.
2.6 i18n keys (`search.*`).

## 3. Tests

3.1 Map: typing filters markers, accent- and language-insensitive, status + link, Clear and Escape, card closes.
3.2 List: filtered sections and count, no results + Clear search, combined with layers.
3.3 URL: shared `?q=`, typing writes `q` with `replace`, a cleared search removes it, survives map ↔ list.
3.4 Show on map from the events page clears a non-matching search.

## 4. Wrap-up

4.1 Tick Phase 12 in `specs/roadmap.md`; tick the PR-only boxes of the Phase 8–11 validation files (PR #7 CI green, sizes in its body).
4.2 `npm run ci`; commit `feat: add bilingual client-side search to the map and list (Phase 12)`.
4.3 Push the branch and open the PR with the bundle sizes.
