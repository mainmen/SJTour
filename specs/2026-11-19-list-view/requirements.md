# Phase 11: List View — Requirements

- **Branch:** `feature/trails-filters-views`, committed on top of the Phase 10 commit. Phases 8–11 go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 11
- **Guidance:** `specs/mission.md` (Map-centric, list-friendly; Accessible), `specs/tech-stack.md` (WCAG 2.1 AA, with a list view equivalent to the map)

## Context

The map is not usable by everyone (screen readers, keyboard-only users, very small screens). The list is its accessible equivalent: the same items, the same filters, and a way back to the map.

## Scope

### In scope

1. **`/list` page** (lazy, `ListRoute`): an `h2`, the same `LayerFilter` chips as the map (same store, same `?layers=` URL through `useFilterUrlSync`), a polite status with the item count, then one section per category with at least one enabled layer.
2. **Sections:** an `h3` with icon, label and count ("Things to do (6)"), and a list of items sorted by name in the active language (`sortByName`). Each category has its own loading, empty and error (Retry) state.
3. **Items:** the name as an `h4` link to the detail page (Phase 10), a one-line summary from the module (`Summary`: kind · sector, subcategory, event dates, length · difficulty · type), the address, the sample badge, and a **Show on map** button.
4. **Same rules as the map:** `visibleRecords` (no past events; layers). A `both` trail is listed once, under Trails.
5. **No layer on:** a message and a **Show all** button.
6. **Map ↔ list sync:** Show on map selects the item as from a list (the map zooms to it, opens its card and moves focus to it, re-enabling hidden layers). Back on the list, the item selected on the map is marked (`aria-current`, a border and a "Selected on the map" label) and scrolled into view.
7. **Module contract:** `Summary` on `WebCategoryModule`.
8. **i18n:** count (plural), category count, states, labels.

### Out of scope

- Search (Phase 12), sorting by distance (Phase 14), virtualization (not needed at ~40 items).

## Decisions

| #   | Decision                                                                                                    | Rationale                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| D1  | **Grouped by category, sorted by name** (events too; the events page keeps chronological order).            | Predictable for screen-reader users navigating by heading; the events page covers "what's on". |
| D2  | **Trails are listed once**, not once per layer.                                                             | The list shows places, not layers.                                                             |
| D3  | **The list shares the filter store and the URL** with the map.                                              | One mental model; `/list?layers=…` is shareable like `/?layers=…`.                             |
| D4  | **Selection is the sync point:** list → map through "Show on map", map → list through the highlighted item. | Reuses the selection store; no new state.                                                      |
| D5  | **Names link to the detail page; the map action is a separate button.**                                     | Two distinct actions with clear names.                                                         |
| D6  | **One commit for this phase**; this commit closes the Phase 8–11 PR.                                        | The one-commit-per-phase rule.                                                                 |
