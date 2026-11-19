# StJeanTour — Roadmap

High-level implementation order, in very small phases. Each phase should be shippable and reviewable on its own: it builds, it passes its tests, and it can be demoed.

## Milestone 1: MVP (read-only map with all 4 categories)

### Phase 0: Project foundation
- [ ] Scaffold Vite + React + TypeScript (strict)
- [ ] Add ESLint, Prettier, Vitest, and the `@/` path alias
- [ ] Add Tailwind CSS with mobile-first base styles
- [ ] Add a basic CI workflow (lint, typecheck, test, build)

### Phase 1: App shell
- [ ] Mobile-first layout: header, full-screen content area, bottom nav
- [ ] Set up React Router with placeholder routes (`/`, `/list`, `/about`)

### Phase 2: Internationalization
- [ ] Set up react-i18next with `fr` (default) and `en`
- [ ] Add a language toggle that persists the choice locally
- [ ] Move all shell strings into translation files

### Phase 3: Base map
- [ ] Full-screen Leaflet map centered on Saint-Jean-sur-Richelieu
- [ ] OSM tiles with attribution
- [ ] Zoom controls and a sensible min/max zoom

### Phase 4: Module contract and data layer
- [ ] Define the shared `CategoryModule` interface
- [ ] Define the base Zod schema (bilingual fields, coordinates, `lastVerified`)
- [ ] Write a generic JSON loader with validation and error states

### Phase 5: Companies module
- [ ] Seed `companies.json` (about 10 real entries)
- [ ] Show markers on the map
- [ ] Show a bottom-sheet card when a marker is tapped

### Phase 6: Activities module
- [ ] Seed `activities.json`
- [ ] Add markers and cards, reusing the module contract

### Phase 7: Events module
- [ ] Seed `events.json` with start and end dates (America/Montreal)
- [ ] Add markers and cards, hiding past events by default
- [ ] Add date display formatted per locale

### Phase 8: Trails module
- [ ] Seed `trails.geojson` with 2 or 3 trails
- [ ] Render polylines styled by type (walk / bike / both)
- [ ] Show a trail card with length, difficulty and surface

### Phase 9: Category filtering
- [ ] Add category toggle chips that show or hide each layer
- [ ] Keep the filter state in URL query params so views can be shared

### Phase 10: Detail view
- [ ] Add a `/:category/:id` detail route with full info
- [ ] Add a "Directions" button that hands off to the device's maps app
- [ ] Make the URL deep-linkable and shareable

### Phase 11: List view
- [ ] Add an accessible list of all visible items, using the same filters as the map
- [ ] Sync the map and list (selecting an item in the list focuses it on the map)

### Phase 12: Search
- [ ] Add client-side text search across names and descriptions in both languages

### Phase 13: MVP polish and release
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

## Milestone 3: Content at scale (future)

### Phase 19: Content backend
- [ ] Move data to a headless CMS or Supabase/PostGIS behind the existing loader interface

### Phase 20: Content workflow
- [ ] Add an editor workflow for businesses and the city to submit and update listings

### Phase 21: Privacy-friendly analytics
- [ ] Add cookieless usage metrics to guide future content decisions
