# Phase 12: Search — Validation

The Phase 12 commit and PR on `feature/search` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally
- [ ] The CI run on the pull request is green

## 2. Core

- [x] Test: normalization ignores case, accents, ligatures and punctuation
- [x] Test: every query word must start a word of the name or description, in French or English
- [x] Test: an empty or blank query matches everything
- [x] Test: the store sets and clears the query without spurious updates; `showAll` keeps it
- [x] Test: `visibleRecords` applies the search after `visibleOnMap` and the layers
- [x] Test: `q` parse/serialize (absent, blank, capped, round-trip)

## 3. Map

- [x] Test: typing hides non-matching markers; accents and language don't matter
- [x] Test: a polite status counts the results and links to the list
- [x] Test: Clear (button) and Escape bring every marker back, focus stays in the box
- [x] Test: searching away the selected record closes its card
- [ ] Manual: search box, chips and alert fit at 360 px; the on-screen keyboard closes on Enter

## 4. List

- [x] Test: sections and counts follow the search; categories without a match are left out
- [x] Test: no match shows "No results" and Clear search brings everything back
- [x] Test: search and layers combine

## 5. URL and sync

- [x] Test: a shared `?q=` link fills the box and filters
- [x] Test: typing writes `q` with `replace`; clearing removes it
- [x] Test: the search survives map → list → map through the nav
- [x] Test: Show on map from the events page clears a search the event doesn't match

## 6. Hygiene

- [ ] Sizes recorded in the PR description (no new dependency)
- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 12 is checked off in `specs/roadmap.md`
