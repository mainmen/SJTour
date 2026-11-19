# Phase 3: Base Map — Validation

The Phase 3 commit (and the combined Phase 2 + 3 PR) on `feature/i18n-base-map` can merge only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [x] `npm run format:check`
- [x] `npm run lint`: 0 errors, 0 warnings (including the core boundary rule)
- [x] `npm run typecheck`
- [x] `npm run test`: all tests pass
- [x] `npm run build`: no errors or warnings
- [x] `npm run ci` passes locally from a clean install
- [x] The CI run on the pull request is green (PR #5, merged as ecd24fe)

## 2. Map configuration

- [x] `src/core/map/config.ts` holds the center `[45.3073, -73.2625]`, zoom 13 (min 11, max 18) and `MAX_BOUNDS`, with tests
- [x] `src/core/` has no Leaflet imports

## 3. Map rendering

- [x] Test: the map container renders with a translated accessible name
- [x] Test: the OSM tile URL pattern is used
- [x] Test: "© OpenStreetMap contributors" and the copyright link are present
- [x] Test: the zoom buttons have translated titles and update when the language changes
- [x] Manual: tiles load, centered on Saint-Jean-sur-Richelieu (old Saint-Jean and the Richelieu River are visible) (headless Edge, production preview: 8 tiles at 360 × 640, 24 at 1280 × 800, old Saint-Jean, Iberville and the river in view)
- [x] Manual: you can't zoom out past 11 or in past 18, and panning is pulled back inside the bounds (covered by a jsdom test that clicks past both limits; headless Edge can't finish Leaflet's zoom animation under virtual time. Bounds are passed to Leaflet from the tested config.)

## 4. Layout and glass

- [x] Test: `/` uses the full-bleed layout and `/about` does not
- [x] Manual: the header and nav float over the map, and the glass blur is visible (screenshots at 360 × 640 and 1280 × 800)
- [x] Manual: the attribution and zoom controls are fully visible and not covered by the nav or header (measured at 360 × 640: attribution bottom = nav top = 583 px; zoom buttons at 466–510 px)

## 5. Accessibility

- [x] The zoom buttons are at least 44 × 44 px and have a visible focus ring
- [ ] Manual: Tab moves through the header toggle, the map controls and the nav, with no focus trap (pending: needs an interactive browser)
- [ ] Manual: the map can be panned and zoomed with the keyboard (arrow keys and +/-) once focused (pending: needs an interactive browser; Leaflet keyboard handling is on by default and the container is focusable)

## 6. Manual mobile check (dev server)

- [ ] **360 × 640:** the map fills the viewport, there is no page scroll, and pinch zoom and drag work (touch emulation) (pending: pinch and drag need touch emulation; headless Edge showed the map filling 360 × 640 with no page scroll)
- [x] **Desktop (1280 × 800):** the map fills the viewport and the controls are placed correctly (headless Edge: map 1280 × 800, no scroll)
- [ ] **iPhone with notch (devtools preset):** the controls and attribution respect the safe areas (pending: needs the devtools preset; offsets use `env(safe-area-inset-*)`)
- [x] Switching languages updates the zoom titles without resetting the map view (jsdom test: same map element after the switch; headless Edge: title "Zoom in" after toggling)
- [x] The browser console shows no errors or warnings (headless Edge console log)

## 7. Bundle size and lazy loading

- [x] The main chunk size before and after and the map chunk size (gzipped) are recorded in the PR description (main 96.86 → 97.95 kB; map chunk 45.00 kB JS + 6.55 kB CSS, in PR #5)
- [x] Manual or build check: visiting `/about` directly downloads no Leaflet chunk (headless Edge resource list on `/about`: only `index-*.js`/`.css`; Leaflet appears only in `MapPage-*.js`)
- [x] The total is well under the ~200 KB gzipped budget

## 8. Scope and hygiene

- [x] The only new dependencies are `leaflet`, `react-leaflet` and `@types/leaflet` (dev)
- [x] No markers, data loading, stores or clustering (later phases)
- [x] No hard-coded user-facing strings (the OSM attribution is the documented exception, D5)
- [x] The phase is a single commit on top of the Phase 2 commit, with a conventional commit message
- [x] Phase 3 is checked off in `specs/roadmap.md`
- [x] One PR covers both phases, and its description lists both phases' bundle numbers (PR #5)
