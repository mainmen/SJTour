# Phase 10: Detail View — Validation

The Phase 10 commit (and the combined Phase 8–11 PR) on `feature/trails-filters-views` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally
- [x] The CI run on the pull request is green

## 2. Core

- [x] Test: iPhone and Mac user agents pick Apple Maps; Android and Windows pick Google Maps
- [x] Test: Google and Apple directions links carry only the destination, rounded to 6 decimals

## 3. Detail page

- [x] Test: a deep link shows the record (name as `h2`, category, card) and sets the document title
- [x] Test: a trail's page shows its facts
- [x] Test: Directions opens Google Maps (or Apple Maps on Apple devices) in a new tab with `noopener`
- [x] Test: Share uses the share sheet when present, otherwise copies the link and says so
- [x] Test: Show on map re-enables a hidden layer, selects the record and opens its card on the map
- [x] Test: an unknown id says "Fiche introuvable"; an unknown category shows the not-found page
- [x] Test: a load error shows an alert, and Retry recovers
- [x] Test: Back goes to the map when the page was opened directly
- [ ] Manual: Directions opens the maps app on a real phone (iOS and Android)
- [ ] Manual: a deep link reloads correctly in the production preview

## 4. Entry points

- [x] Test: the bottom sheet's "Full details" link opens the page, and Back returns to the map
- [x] Test: an event name in the events list opens its page

## 5. Bundle and hygiene

- [x] The detail chunk is lazy; sizes recorded in the PR description
- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 10 is checked off in `specs/roadmap.md`
