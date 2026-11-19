# Phase 9: Category Filtering — Plan

This plan starts after the Phase 8 commit. The phase lands as **one commit**. See `requirements.md` and `validation.md`.

## 1. Core (tests first)

1.1 `src/core/filters/layers.ts`, `selectors.ts`, `url.ts`; `src/core/store/filters.ts`.
1.2 Add `layers` to `CoreCategoryModule` and to the four modules (and the test fixture).
1.3 `filters.test.ts`: layer ownership, selectors (both trails), store, URL parse/serialize.

## 2. Web

2.1 `filterStore` instance; tests reset it.
2.2 `WebLayer` and `layers` on `WebCategoryModule`; `OverlayProps.layers`; `TrailLines` draws enabled layers only.
2.3 `CategoryMarkers` uses `visibleRecords` with the enabled layers.
2.4 `FilterChips` (UI) and `LayerFilter` (bound); on the map in a top stack with `LoadErrors`.
2.5 Close the card when its record is hidden.
2.6 `useFilterUrlSync` on `MapRoute`.
2.7 i18n keys.

## 3. Tests

3.1 `MapPage`: chips, toggling categories, trail layers, closing the card, English labels.
3.2 URL sync: shared link, toggling writes with replace, empty and broken parameters, nav round-trip.
3.3 Registry: web chips match core layers.

## 4. Wrap-up

4.1 Tick Phase 9 in `specs/roadmap.md`; `npm run ci`; commit `feat: add layer filter chips mirrored to the URL (Phase 9)`.
