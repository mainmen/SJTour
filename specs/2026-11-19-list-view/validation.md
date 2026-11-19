# Phase 11: List View — Validation

The Phase 11 commit (and the combined Phase 8–11 PR) on `feature/trails-filters-views` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally
- [ ] The CI run on the pull request is green

## 2. Content

- [x] Test: every visible item is listed, grouped under `h3` headings with counts, with a total in a status
- [x] Test: items are sorted by name in the active language
- [x] Test: each category shows its summary line (kind · sector, subcategory, dates, length · difficulty · type)
- [x] Test: past events are not listed
- [x] Test: names link to the detail page

## 3. Filters

- [x] Test: the chips hide and show categories and update `?layers=`
- [x] Test: a shared `/list?layers=biking` link lists the `both` trail once
- [x] Test: with no layer on, "Show all" brings everything back

## 4. Map ↔ list

- [x] Test: "Show on map" opens the map with the item selected and its card focused
- [x] Test: the item selected on the map is marked (`aria-current`, label) when coming back
- [ ] Manual: the selected item scrolls into view in a real browser

## 5. States and accessibility

- [x] Test: a failing category shows an alert, and Retry recovers
- [x] Test: English labels and plural count
- [ ] Manual: screen-reader pass (headings, lists, buttons named after the item)

## 6. Hygiene

- [ ] Sizes recorded in the PR description
- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 11 is checked off in `specs/roadmap.md`
- [x] One PR covers Phases 8–11
