# Phase 13: MVP Polish and Release — Validation

The Phase 13 commit and PR on `feature/mvp-release` can merge when every box in sections 1–6 is checked. Section 7 tracks the release itself.

## 1. Automated checks

- [x] `npm run ci` passes locally (now including the bundle budget)
- [ ] The CI run on the pull request is green

## 2. Clustering

- [x] Test: projection matches Leaflet's Web Mercator and round-trips
- [x] Test: points within the radius merge (mean position, extent); distant ones don't; output is stable
- [x] Test: clusters split as the zoom grows; nothing clusters above zoom 15
- [x] Test: an overlapping pair shows as a labelled badge with its count, not as two markers
- [x] Test: tapping the badge, or Enter on it, splits it; Enter moves focus to the first member
- [x] Test: the selected record keeps its own marker, and focus returns to it when its card closes
- [x] Marker sizes: 25 px pins (40 px when selected) and 20 px cluster badges with a 10 px icon, inside 44 × 44 px tap targets (`map.css`; `iconSize` unchanged)
- [x] The cluster count fits inside the badge for 1–3 digits (headless Edge measurement: 11 px text in the 16 px inner height; badge 30–43 px wide). Before the fix the 15 px count (22.5 px line) overflowed the 14 px inner height
- [ ] Manual: badges look right and split smoothly at 360 px (and with reduced motion); the count is legible on a real phone

## 3. States

- [x] Test: the map says places are loading, then nothing
- [x] Test: no layer on → message and Show all
- [x] Test: filters leaving nothing to show → message and Show all
- [x] Test: search results and load errors still work (Phase 12 tests, LoadErrors tests)

## 4. Accessibility

- [x] Test: the skip link is the first tab stop and focuses `<main>` without changing the URL
- [x] Test: each page has its own title, in the active language; the detail page keeps its own
- [x] Test: focus goes to `<main>` when the focused link left the page, and stays on a nav link otherwise
- [x] Test: contrast, reduced motion, keyboard markers and sheet (existing suites)
- [ ] Manual: screen-reader pass (VoiceOver iOS, TalkBack or NVDA): skip link, titles, clusters, map status, list
- [ ] Manual: keyboard-only walk through map → list → detail → back

## 5. Performance and hosting

- [x] Test: the release check finds sample records (arrays, GeoJSON) and fails on today's data
- [x] Test: the bundle check follows static imports only
- [x] `npm run check:bundle`: home page JS ≈ 187 kB gzipped (budget 200 kB)
- [x] A `BASE_PATH=/SJTour/` build references `/SJTour/assets/…`
- [ ] Sizes recorded in the PR description

## 6. Hygiene

- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; done items are checked off in `specs/roadmap.md`

## 7. Release (owner, after merge)

- [ ] Every `sample: true` record replaced by a real, verified entry (~10 per category); `npm run check:release` passes
- [ ] Pages enabled (source: GitHub Actions) and the **Deploy** workflow run on `main`
- [ ] Deep link (`/SJTour/list`) and data load checked on the live site
