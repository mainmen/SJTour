# Phase 6: Activities Module — Validation

The Phase 6 commit (and the combined Phase 4–7 PR) on `feature/content-modules` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally from a clean install
- [ ] The CI run on the pull request is green

## 2. Core

- [x] Test: the activity schema accepts each subcategory and rejects others
- [x] Test: `bySubcategory` and `groupBySubcategory`
- [x] Test: `public/data/activities.json` validates, covers all four subcategories, and is all `sample: true`

## 3. Web

- [x] Test: activity markers render alongside company markers, with their own names
- [x] Test: tapping an activity marker opens its card with the subcategory badge
- [x] Manual: activity pins are distinct from company pins by icon and colour (headless Edge, 360 × 640, English: green Trees pins vs blue Building pins)

## 4. Modularity

- [x] The diff touches only the module folders, the two registries, `map.css`, the translation files, the data file and tests (D1) (`map.css` didn't even need a change: the tone existed)

## 5. Hygiene

- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 6 is checked off in `specs/roadmap.md`
