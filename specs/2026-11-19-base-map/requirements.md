# Phase 3: Base Map — Requirements

- **Branch:** `feature/i18n-base-map`, committed on top of the Phase 2 commit. Both phases go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 3
- **Guidance:** `specs/tech-stack.md` (Map, Map tiles, Map defaults, map attribution constraint, Visual style)

## Context

Phase 2 gave the shell i18n. The `/` route still shows a placeholder. This phase replaces it with a full-screen Leaflet map of Saint-Jean-sur-Richelieu that uses OpenStreetMap tiles. On this route the glass header and bottom nav float over the map, so the glass effect finally has a backdrop.

## Scope

### In scope

1. **Dependencies:** `leaflet`, `react-leaflet` 4.2 (v5 requires React 19) and `@types/leaflet` (dev).
2. **Map config in core:** `src/core/map/config.ts` holds pure data: `MAP_CENTER = [45.3073, -73.2625]`, `INITIAL_ZOOM = 13`, `MIN_ZOOM = 11`, `MAX_ZOOM = 18`, `MAX_BOUNDS` (a padded box around the municipality), and the OSM tile URL and attribution. It has unit tests.
3. **`MapCanvas`** in `src/web/map/MapCanvas.tsx`: a `MapContainer` with the config above, `maxBoundsViscosity` so the map resists panning out of bounds, a `TileLayer` for OSM, the attribution control, and a bottom-right `ZoomControl` (above the nav, in thumb reach) whose button titles are translated. The map container itself gets `role="region"` and the translated `aria-label`, since `MapContainer` passes no ARIA props to its DOM node.
4. **Map page:** `MapPage` renders `MapCanvas` full-bleed. The map region has a translated accessible name, and the page title becomes a visually hidden `h2`.
5. **Full-bleed layout:** on the map route only, the content area fills the whole viewport behind the glass header and nav. Other routes keep the current flex layout. Leaflet's controls and attribution sit inside the visible area, clear of the header, the nav and the safe-area insets: the header and nav bars get a fixed `--shell-bar-height` (3.5rem, plus border and safe-area padding), and `src/web/map/map.css` offsets the Leaflet corners by it.
6. **Lazy loading:** the map page, including Leaflet and its CSS, loads through `React.lazy` and `Suspense`, with a translated loading fallback. `/list` and `/about` do not download Leaflet.
7. **i18n:** new keys in `fr.json` and `en.json` for the map region label, zoom in/out, and loading. The unused `pages.map.placeholder` key is removed.
8. **Tests:** the core config values; `MapPage` rendered with real react-leaflet in jsdom (map container present, zoom buttons with translated titles, the OSM attribution text and link, the tile URL); the layout switching to full-bleed only on `/`; the existing routing tests still passing with the lazy route.

### Out of scope (later phases)

- Markers, data loading and cards (Phase 4 onward).
- Clustering (Phase 13).
- Geolocation or "near me" (Phase 14).
- Offline tile caching (Phase 17).
- Playwright E2E tests.
- Leaflet's default marker icon fix (needed only once markers exist).

## Decisions

| #   | Decision                                                                                                                                                                                                                 | Rationale                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| D1  | **Full-bleed under the glass on `/` only.** The layout reads a route `handle` (for example `{ fullBleed: true }`) through `useMatches`, so the layout does not hard-code paths.                                          | The glass panels get real content behind them. Text pages keep the simpler flow layout.                        |
| D2  | **Zoom 11–18, starting at 13, with `maxBounds`** set to a padded box around Saint-Jean-sur-Richelieu and `maxBoundsViscosity` around 0.8.                                                                                | Zoom 11 shows the whole municipality. 18 stays inside OSM's tile range. Users can't get lost panning away.     |
| D3  | **Map constants live in `src/core/map/config.ts`** as plain data with no Leaflet types.                                                                                                                                  | They are platform-agnostic and reusable by a future native shell (Phase 24). They are also easy to test.       |
| D4  | **Lazy-load the map route.** Leaflet's CSS is imported inside the lazy chunk.                                                                                                                                            | Pages that don't need the map stay light. The ~45 KB gzipped map cost is paid only on `/`.                     |
| D5  | **The OSM attribution is the fixed English legal notice** "© OpenStreetMap contributors", with a link to `https://www.openstreetmap.org/copyright`, defined in the core config. It is not translated.                    | `tech-stack.md` requires exactly this text to stay visible. Leaflet's `TileLayer` attribution is not reactive. |
| D6  | **Translated zoom titles remount the `ZoomControl` on language change** (it is keyed by language). The map itself does not remount.                                                                                      | react-leaflet does not update control options after mount. Remounting the map would lose the user's view.      |
| D7  | **Testing uses real react-leaflet in jsdom**: assertions on the DOM Leaflet builds (container, controls, attribution, tile `img` URLs). Visual and tile loading checks are manual, in `validation.md`.                   | It tests what users get without mocks, and it adds no Playwright yet.                                          |
| D8  | **OSM tiles from `https://tile.openstreetmap.org/{z}/{x}/{y}.png`**, with no API key, following the OSM tile usage policy (low MVP traffic, valid Referer). A move to a tile provider is noted for before heavy traffic. | Matches `tech-stack.md` and the "no API keys" constraint.                                                      |
| D9  | **One commit for this phase**, made on top of the Phase 2 commit once `npm run ci` is green.                                                                                                                             | Keeps the one-commit-per-phase rule.                                                                           |

## Constraints

- "© OpenStreetMap contributors" is always visible on the map, never hidden behind the glass nav, at 360 px and on desktop.
- The zoom buttons are at least 44 × 44 px (Leaflet's defaults are enlarged), keyboard operable and labelled in the active language.
- The map does not trap keyboard focus. The header toggle and nav stay reachable by Tab.
- No page-level scroll on `/`. The map fills the viewport at 360 × 640 and on desktop.
- `src/core/` stays free of Leaflet, React and browser globals.
- The gzipped JS sizes are recorded: the main chunk before and after (it should barely change thanks to lazy loading), plus the size of the map chunk.
