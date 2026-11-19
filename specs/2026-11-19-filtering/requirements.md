# Phase 9: Category Filtering — Requirements

- **Branch:** `feature/trails-filters-views`, committed on top of the Phase 8 commit. Phases 8–11 go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 9
- **Guidance:** `specs/tech-stack.md` (State: filter state mirrored to URL query params), `specs/mission.md` (Trails as two layers)

## Context

With four categories and two trail layers on one map, users need to switch layers on and off, and share the filtered view as a link. The list view (Phase 11) will use the same filters.

## Scope

### In scope

1. **Layers in core** `src/core/filters/layers.ts`: `LAYER_IDS` = `companies`, `activities`, `events`, `walking`, `biking`; `MapLayer<T>` (`id`, optional `includes(record)`); `normalizeLayers`.
2. **Module contract:** `CoreCategoryModule.layers` (required). Point modules have one layer each; trails have `walking` (walk + both) and `biking` (bike + both).
3. **Filter selectors** `src/core/filters/selectors.ts`: `recordLayers`, `enabledModuleLayers`, `isRecordVisible`, `filterRecords`, `visibleRecords` (`visibleOnMap`, then layers).
4. **Filter store** `src/core/store/filters.ts`: `enabled` (distinct, display order, all by default), `toggle`, `setEnabled`, `enable`, `showAll`; no state change when nothing changes.
5. **URL format** `src/core/filters/url.ts`: `?layers=<ids, comma-separated>`; absent = no opinion; empty = all off; unknown ids ignored; nothing known = ignored. All on = no parameter.
6. **Web:** `FilterChips` (`src/web/ui/`, toggle buttons with `aria-pressed`, a check mark when on) and `LayerFilter` (bound to the store, labels and icons from each web module's `layers`). Shown under the header on the map, above the load-error alert.
7. **Map:** markers and trail lines follow the enabled layers; a `both` trail shows while either trail layer is on; hiding the selected record's layers closes its card.
8. **URL sync** `useFilterUrlSync` on the map route.
9. **i18n:** group label and the five layer labels ("Walking paths" / « Sentiers pédestres », "Biking paths" / « Pistes cyclables »).

### Out of scope

- The list view (Phase 11, reuses the same store and hook), search (Phase 12), sector filters for the business network (Phase 19).

## Decisions

| #   | Decision                                                                                                                                              | Rationale                                                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| D1  | **Filters are layers, not categories:** five layer ids; modules declare which layers their records belong to.                                         | Trails need two toggles; the map stays generic over modules.                                  |
| D2  | **Chips are toggle buttons** (`aria-pressed`) in a labelled group; on = filled with a check, off = outlined with the layer icon.                      | Native semantics; the state never relies on colour alone.                                     |
| D3  | **URL ↔ store:** a URL with `layers` wins (shared link); a URL without it gets the current filters written in, with `replace`. All on = no parameter. | Clean default URLs, shareable filtered views, no Back-button spam, filters survive nav links. |
| D4  | **A broken parameter is ignored**, not read as "nothing".                                                                                             | A mistyped link should still show a useful map.                                               |
| D5  | **Hiding the selected record closes its card.**                                                                                                       | A card for an invisible record is confusing.                                                  |
| D6  | **One commit for this phase.**                                                                                                                        | The one-commit-per-phase rule.                                                                |
