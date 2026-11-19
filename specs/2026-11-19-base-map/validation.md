# Phase 3: Base Map — Validation

The Phase 3 commit (and the combined Phase 2 + 3 PR) on `feature/i18n-base-map` can merge only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [ ] `npm run format:check`
- [ ] `npm run lint`: 0 errors, 0 warnings (including the core boundary rule)
- [ ] `npm run typecheck`
- [ ] `npm run test`: all tests pass
- [ ] `npm run build`: no errors or warnings
- [ ] `npm run ci` passes locally from a clean install
- [ ] The CI run on the pull request is green

## 2. Map configuration

- [ ] `src/core/map/config.ts` holds the center `[45.3073, -73.2625]`, zoom 13 (min 11, max 18) and `MAX_BOUNDS`, with tests
- [ ] `src/core/` has no Leaflet imports

## 3. Map rendering

- [ ] Test: the map container renders with a translated accessible name
- [ ] Test: the OSM tile URL pattern is used
- [ ] Test: "© OpenStreetMap contributors" and the copyright link are present
- [ ] Test: the zoom buttons have translated titles and update when the language changes
- [ ] Manual: tiles load, centered on Saint-Jean-sur-Richelieu (old Saint-Jean and the Richelieu River are visible)
- [ ] Manual: you can't zoom out past 11 or in past 18, and panning is pulled back inside the bounds

## 4. Layout and glass

- [ ] Test: `/` uses the full-bleed layout and `/about` does not
- [ ] Manual: the header and nav float over the map, and the glass blur is visible
- [ ] Manual: the attribution and zoom controls are fully visible and not covered by the nav or header

## 5. Accessibility

- [ ] The zoom buttons are at least 44 × 44 px and have a visible focus ring
- [ ] Manual: Tab moves through the header toggle, the map controls and the nav, with no focus trap
- [ ] Manual: the map can be panned and zoomed with the keyboard (arrow keys and +/-) once focused

## 6. Manual mobile check (dev server)

- [ ] **360 × 640:** the map fills the viewport, there is no page scroll, and pinch zoom and drag work (touch emulation)
- [ ] **Desktop (1280 × 800):** the map fills the viewport and the controls are placed correctly
- [ ] **iPhone with notch (devtools preset):** the controls and attribution respect the safe areas
- [ ] Switching languages updates the zoom titles without resetting the map view
- [ ] The browser console shows no errors or warnings

## 7. Bundle size and lazy loading

- [ ] The main chunk size before and after and the map chunk size (gzipped) are recorded in the PR description
- [ ] Manual or build check: visiting `/about` directly downloads no Leaflet chunk
- [ ] The total is well under the ~200 KB gzipped budget

## 8. Scope and hygiene

- [ ] The only new dependencies are `leaflet`, `react-leaflet` and `@types/leaflet` (dev)
- [ ] No markers, data loading, stores or clustering (later phases)
- [ ] No hard-coded user-facing strings (the OSM attribution is the documented exception, D5)
- [ ] The phase is a single commit on top of the Phase 2 commit, with a conventional commit message
- [ ] Phase 3 is checked off in `specs/roadmap.md`
- [ ] One PR covers both phases, and its description lists both phases' bundle numbers
