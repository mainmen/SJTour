# Phase 3: Base Map — Plan

This plan starts after the Phase 2 commit. Each task group ends with `npm run ci` passing, and the phase lands as **one commit** (D9). See `requirements.md` and `validation.md`.

## 0. Baseline

0.1 Run `npm run build` on the Phase 2 commit and record the gzipped JS size.

## 1. Core map config

1.1 Add `src/core/map/config.ts` with the center, zoom levels, bounds, tile URL and attribution (D2, D3, D5, D8).
1.2 Write `config.test.ts`: the center is `[45.3073, -73.2625]`; `MIN_ZOOM < INITIAL_ZOOM < MAX_ZOOM ≤ 19`; the center lies inside `MAX_BOUNDS`; the attribution contains "© OpenStreetMap contributors" and the copyright link.

## 2. Dependencies and Leaflet in jsdom

2.1 Install `leaflet` and `react-leaflet` (React 18–compatible), plus `@types/leaflet` as a dev dependency.
2.2 Confirm that react-leaflet renders in jsdom. Add any small test polyfills it needs (for example a `ResizeObserver` or layout stubs) in `src/test/setup.ts`, with comments.

## 3. MapCanvas

3.1 Build `src/web/map/MapCanvas.tsx`: `MapContainer` (`zoomControl={false}`, bounds, viscosity), `TileLayer`, and a `ZoomControl` keyed by language with translated titles (D6). Import `leaflet/dist/leaflet.css` here.
3.2 Add the map i18n keys (region label, zoom in, zoom out, loading) to `fr.json` and `en.json`.
3.3 Style the Leaflet controls: 44 × 44 px zoom buttons, the focus ring token, and offsets that keep the controls and attribution clear of the glass header and nav, including the safe areas.
3.4 Write tests: the map container is present and labelled; the zoom buttons have the French titles and switch to English after a language change; the attribution text and link are present; the tile `img` sources match the OSM URL pattern.

## 4. Full-bleed layout and lazy route

4.1 Add `handle: { fullBleed: true }` to the `/` route, and make `AppLayout` read it through `useMatches` (D1). In full-bleed mode, `main` is an absolutely positioned layer behind the header and nav, which stay on top.
4.2 Switch `MapPage` to render `MapCanvas` with a visually hidden `h2`, and load it with `React.lazy` and a `Suspense` fallback that uses the translated loading text (D4).
4.3 Update the layout and routing tests to await the lazy page. Add tests that `/` is full-bleed and `/about` is not.

## 5. Wrap-up

5.1 Run `npm run build` and record the main chunk and map chunk gzipped sizes. Confirm that `/about` loads no Leaflet chunk (network panel or build manifest).
5.2 Work through `validation.md`.
5.3 Tick off Phase 3 in `specs/roadmap.md`.
5.4 Run `npm run ci`, then make the phase commit: `feat: add full-screen Leaflet base map (Phase 3)`.
5.5 Push the branch and open one PR covering Phases 2 and 3.
