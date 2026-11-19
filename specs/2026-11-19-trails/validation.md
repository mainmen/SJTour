# Phase 8: Trails Module — Validation

The Phase 8 commit (and the combined Phase 8–11 PR) on `feature/trails-filters-views` can merge only when every box below is checked.

## 1. Automated checks

- [x] `npm run ci` passes locally
- [x] The CI run on the pull request is green

## 2. Core

- [x] Test: haversine distance, path length and bounds
- [x] Test: the schema accepts LineString and MultiLineString and rejects a bad type, difficulty, surface, network or length, a point geometry and a one-position line
- [x] Test: positions written as `[lat, lng]` are rejected
- [x] Test: a FeatureCollection reads into records with the trailhead as `coordinates`; a non-collection file is rejected
- [x] Test: `both` trails are in the walking and the biking layer
- [x] Test: `public/data/trails.geojson` validates, has 2–3 trails including the Chambly Canal path on La Route verte, lengths within 10 % of the path, all `sample: true`

## 3. Map

- [x] Test: 2 walking (dashed) and 2 biking (solid) lines, plus 3 trailhead markers
- [x] Test: tapping a line opens the trail card and thickens the line
- [x] Test: line colours are at least 3:1 on white
- [ ] Manual: lines follow the Richelieu at 360 × 640 (headless Edge, production preview)

## 4. Card

- [x] Test: type, network, length (`15,1 km` / `15.1 km`), difficulty and surface in both languages

## 5. Bundle and hygiene

- [x] Gzipped sizes recorded in the PR description; `/` under ~200 kB
- [x] No hard-coded user-facing strings
- [x] The phase is a single commit; Phase 8 is checked off in `specs/roadmap.md`
