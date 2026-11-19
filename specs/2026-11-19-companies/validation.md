# Phase 5: Companies Module — Validation

The Phase 5 commit (and the combined Phase 4–7 PR) on `feature/content-modules` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally from a clean install
- [x] The CI run on the pull request is green

## 2. Core

- [x] Test: the company schema accepts a valid record and rejects an unknown `sector` or `kind`
- [x] Test: `parks`, `bySector` and `sortByName` (locale-aware)
- [x] Test: `public/data/companies.json` validates at build time, has a park, and every record is `sample: true`

## 3. Map

- [x] Test: one marker per company, each a button named after the company
- [x] Test: Enter on a focused marker opens its card
- [x] Test: the selected marker has `aria-pressed="true"`
- [x] Manual: markers show at the right places with the company icon (headless Edge, production preview, 360 × 640 and 1280 × 800)

## 4. Bottom sheet

- [x] Test: tapping a marker opens a dialog named after the company, showing the card
- [x] Test: Close and Escape dismiss it, and focus goes back to the marker
- [x] Test: the card shows badges, address, website (new tab, `noopener`), the localized "last verified" date and the sample badge
- [x] Manual: the sheet sits above the nav, and the attribution and zoom buttons move above the sheet (360 × 640; the tapped marker is panned clear of the sheet)

## 5. Error state

- [x] Test: a failing category shows a translated alert; Retry loads it again

## 6. Accessibility

- [x] Markers and the close button are at least 44 × 44 px with a visible focus ring (marker `iconSize` 44 × 44, close button `size-11`; white-on-marker contrast tested)
- [x] Category, kind and sector are shown as text, not by colour alone

## 7. Bundle and hygiene

- [x] Main and map chunk gzipped sizes recorded in the PR description; total under ~200 kB (main 98.68 → 99.41 kB; map chunk 45.00 → 74.00 kB, mostly Zod; ~173 kB on `/`)
- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 5 is checked off in `specs/roadmap.md`
