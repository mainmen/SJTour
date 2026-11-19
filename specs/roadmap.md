# StJeanTour — Roadmap

High-level implementation order, in very small phases. Each phase should be shippable and reviewable on its own: it builds, it passes its tests, and it can be demoed.

## Milestone 1: MVP (read-only map with all 4 categories)

### Phase 0: Project foundation

- [x] Scaffold Vite + React + TypeScript (strict)
- [x] Add ESLint, Prettier, Vitest, and the `@/` path alias
- [x] Add Tailwind CSS with mobile-first base styles
- [x] Add a basic CI workflow (lint, typecheck, test, build)

### Phase 1: App shell

- [x] Create the `src/core/` and `src/web/` layer folders
- [x] Add an ESLint rule that stops `core` from importing `web`, React DOM, Leaflet or browser globals
- [x] Mobile-first layout: header, full-screen content area, bottom nav (with Lucide icons)
- [x] Set up React Router with placeholder routes (`/`, `/list`, `/about`)

### Phase 1b: UI primitives

- [x] Build `GlassCard` and `RippleButton`, with reduced-motion support and AA contrast
- [x] Add a test that checks the reduced-motion behavior

### Phase 2: Internationalization

- [x] Set up react-i18next with `fr` (default) and `en`
- [x] Add a language toggle that persists the choice locally
- [x] Move all shell strings into translation files

### Phase 3: Base map

- [x] Full-screen Leaflet map centered on `[45.3073, -73.2625]`
- [x] OSM tiles with attribution
- [x] Zoom controls and a sensible min/max zoom

### Phase 4: Core contracts and data layer (types and tests first)

- [x] Define the shared types and the `CategoryModule` contract (core and web sides) in `src/core/types/`
- [x] Define the base Zod schema (bilingual fields, coordinates, `lastVerified`, optional `sample`)
- [x] Write a generic JSON loader service with validation and error states, with unit tests
- [x] Create the Zustand store skeleton (selection, language), with unit tests

### Phase 5: Companies module

- [x] Core: schema (with `sector` and `kind`), service and unit tests
- [x] Seed `companies.json` with sample entries flagged `sample: true`, including an industrial park
- [x] Web: show markers on the map
- [x] Web: show a bottom-sheet card on a glass panel when a marker is tapped

### Phase 6: Activities module

- [x] Core: schema with `subcategory` (parks, culture, dining, outdoor), service and tests
- [x] Seed `activities.json` with sample entries
- [x] Web: add markers and cards, reusing the module contract

### Phase 7: Events module

- [x] Core: Upcoming/Recent selectors (Recent = ended within the last 30 days), with unit tests
- [x] Seed `events.json` with start and end dates (America/Montreal)
- [x] Web: add markers and cards, plus an events list with Upcoming and Recent tabs and a "Show on map" action
- [x] Add date display formatted per locale

### Phase 8: Trails module

- [x] Seed `trails.geojson` with 2 or 3 trails, including La Route verte and the Chambly Canal path
- [x] Render separate walking and biking layers (`both` trails appear in each)
- [x] Show a trail card with length, difficulty and surface

### Phase 9: Category filtering

- [x] Core: add a Zustand filter store and filter selectors, with unit tests
- [x] Web: add layer toggle chips (`FilterChips`) for Companies, Things to do, Events, Walking paths and Biking paths
- [x] Mirror the filter state to URL query params so views can be shared

### Phase 10: Detail view

- [x] Add a `/:category/:id` detail route with full info
- [x] Add a "Directions" button that hands off to the device's maps app
- [x] Make the URL deep-linkable and shareable

### Phase 11: List view

- [x] Add an accessible list of all visible items, using the same filters as the map
- [x] Sync the map and list (selecting an item in the list focuses it on the map)

### Phase 12: Search

- [x] Add client-side text search across names and descriptions in both languages

### Phase 13: MVP polish and release

- [ ] Replace all sample data with real, verified entries (about 10 per category). The CI check confirms no `sample: true` records ship.
- [ ] Add marker clustering
- [ ] Add loading, empty and error states
- [ ] Run an accessibility pass (keyboard, screen reader, contrast)
- [ ] Check performance against the budget
- [ ] Deploy to static hosting

## Milestone 2: Enhancements (after the MVP)

### Phase 14: "Near me"

- [ ] Add opt-in geolocation, a "you are here" marker and sorting by distance

### Phase 15: Events by date

- [ ] Add "Today / This weekend / Upcoming" filters
- [ ] Add a simple calendar view

### Phase 16: Favorites

- [ ] Save favorites in local storage (no account required)

### Phase 17: PWA and offline

- [ ] Add an installable manifest and icons
- [ ] Cache app data offline, including trail data for use on the path

### Phase 18: Trail details

- [ ] Add an elevation profile, a GPX download and points of interest along each trail

### Phase 19: Business network

- [ ] Core: `company-links.json` schema (source required), a network graph service (links by company, by sector and by cluster) and unit tests
- [ ] Seed only publicly documented links, each with a source
- [ ] Web: add a `ConnectionLines` layer (arcs between companies) with a sector filter and a link detail showing its source

### Phase 20: Walk/bike route preview

- [ ] Core: `RoutingService` interface, a mock implementation using precomputed GeoJSON, distance and time formatting, and unit tests
- [ ] Web: select two pins, choose walk or bike, then show a `RouteOverlay` with distance and estimated time
- [ ] Add an OSRM implementation that points to a self-hosted or licensed instance (never the public demo in production), with the endpoint set in config
- [ ] Allow "my location" as a start point only after explicit consent
- [ ] Hand live guidance off to the device's maps app

## Milestone 3: Content at scale (future)

### Phase 21: Content backend

- [ ] Move data to a headless CMS or Supabase/PostGIS behind the existing loader interface

### Phase 22: Content workflow

- [ ] Add an editor workflow for businesses and the city to submit and update listings

### Phase 23: Privacy-friendly analytics

- [ ] Add cookieless usage metrics to guide future content decisions

### Phase 24: Native app spike (optional)

- [ ] Prototype reusing `src/core/` in a Capacitor or React Native (Expo) shell to confirm the core is truly portable
