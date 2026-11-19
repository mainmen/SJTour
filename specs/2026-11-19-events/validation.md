# Phase 7: Events Module — Validation

The Phase 7 commit (and the combined Phase 4–7 PR) on `feature/content-modules` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally from a clean install
- [ ] The CI run on the pull request is green

## 2. Dates and selectors (core)

- [x] Test: Montreal calendar date for a late-evening instant (already the next day in UTC)
- [x] Test: an event ending today is Upcoming; one that ended yesterday is Recent
- [x] Test: ended 30 days ago is Recent; 31 days ago is Past
- [x] Test: Upcoming is sorted by start, Recent by end (most recent first)
- [x] Test: the schema rejects a date without an offset and an end before the start
- [x] Test: `formatDateRange` in `fr` and `en`, same-day and multi-day
- [x] Test: `public/data/events.json` validates and is all `sample: true`

## 3. Events page

- [x] Test: `/events` shows the Upcoming tab by default, and Recent on click
- [x] Test: arrow keys, Home and End move between tabs (roving tabindex, `aria-selected`)
- [x] Test: an empty tab shows its message
- [x] Test: "Show on map" navigates to `/` and the event's card opens
- [x] Test: the nav has four links, and Events is marked current on `/events`
- [x] Manual: the page at 360 × 640 and 1280 × 800 (headless Edge, production preview, fr and en; "Show on map" lands at zoom 16 with the card open and the attribution above it)

## 4. Map

- [x] Test: past events have no marker
- [x] Test: the event card shows its status and localized dates

## 5. Bundle and hygiene

- [x] Main, map and events chunk gzipped sizes recorded in the PR description; total under ~200 kB (initial 101.3 kB; `/` ≈ 177 kB; `/events` ≈ 130 kB)
- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 7 is checked off in `specs/roadmap.md`
- [x] One PR covers Phases 4–7
