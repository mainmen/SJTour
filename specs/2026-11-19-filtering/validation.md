# Phase 9: Category Filtering — Validation

The Phase 9 commit (and the combined Phase 8–11 PR) on `feature/trails-filters-views` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally
- [ ] The CI run on the pull request is green

## 2. Core

- [x] Test: the five layers are each owned by exactly one module
- [x] Test: a `both` trail is visible when either trail layer is on; a point category only with its own layer
- [x] Test: `visibleRecords` drops past events before applying layers
- [x] Test: the store toggles, sets, enables and shows all, in display order, without spurious updates
- [x] Test: `layers` parse/serialize (absent, empty, unknown ids, all on = no parameter, round-trip)

## 3. Map

- [x] Test: five chips, all pressed by default, in a labelled group, translated
- [x] Test: toggling a chip hides and shows that category's markers
- [x] Test: hiding walking keeps the `both` trail (biking line + marker); hiding both trail layers removes every trail
- [x] Test: hiding the selected record's layer closes its card
- [ ] Manual: the chip row scrolls sideways at 360 px and sits above the load-error alert

## 4. URL

- [x] Test: a shared `?layers=` link sets the filters
- [x] Test: toggling writes the parameter with `replace`; all on removes it
- [x] Test: an empty parameter means all off; an unknown one is dropped
- [x] Test: filters survive leaving the map and coming back through the nav

## 5. Hygiene

- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 9 is checked off in `specs/roadmap.md`
