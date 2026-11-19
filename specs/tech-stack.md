# StJeanTour — Tech Stack

## Summary

| Concern                 | Choice                                                                                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language                | TypeScript (strict mode)                                                                                                                                                                                                                     |
| UI framework            | React 18                                                                                                                                                                                                                                     |
| Build tool / dev server | Vite                                                                                                                                                                                                                                         |
| Styling                 | Tailwind CSS (mobile-first breakpoints)                                                                                                                                                                                                      |
| Icons                   | Lucide (`lucide-react`), imported per icon so unused icons aren't bundled                                                                                                                                                                    |
| Map                     | Leaflet + react-leaflet                                                                                                                                                                                                                      |
| Map tiles               | OpenStreetMap raster tiles, with attribution                                                                                                                                                                                                 |
| Routing                 | React Router (hash- or history-based SPA routes)                                                                                                                                                                                             |
| i18n                    | react-i18next (`fr` default, `en`)                                                                                                                                                                                                           |
| Data (MVP)              | Static JSON + GeoJSON files in the repo                                                                                                                                                                                                      |
| Validation              | Zod schemas for all content files                                                                                                                                                                                                            |
| State                   | Zustand stores in the core; filter state is mirrored to URL query params so views can be shared                                                                                                                                              |
| Walk/bike routing       | OSRM (foot and bike profiles) behind a core `RoutingService` interface, in a later phase. Production uses a self-hosted or properly licensed instance, never the public demo server. Precomputed GeoJSON routes serve as a fallback or mock. |
| PWA / offline           | vite-plugin-pwa (Workbox), in a later phase                                                                                                                                                                                                  |
| Testing                 | Vitest + React Testing Library; Playwright for E2E                                                                                                                                                                                           |
| Linting / format        | ESLint + Prettier                                                                                                                                                                                                                            |
| Package manager         | npm                                                                                                                                                                                                                                          |
| Hosting                 | Static hosting (e.g. Netlify, Vercel or GitHub Pages)                                                                                                                                                                                        |

## Architecture

### Portable core, web presentation, modular by category

The code has two layers. Each content category is a self-contained module in **both** layers.

- **`src/core/`** is pure TypeScript and platform-agnostic: types, Zod schemas, Zustand stores, data services and domain logic (filtering, distances, date handling). It must not import React DOM, Leaflet, Tailwind or browser globals (`window`, `document`, `localStorage`). Platform-specific needs such as storage or geolocation are passed in through small adapter interfaces. An ESLint `no-restricted-imports` rule enforces this boundary.
- **`src/web/`** is the web presentation layer: React components, the map, routing, i18n setup and the adapters for browser APIs. It may import from `core`, but `core` never imports from `web`.

```
src/
  core/
    types/            # shared types (bilingual text, coordinates, CategoryModule contract)
    store/            # Zustand stores (filters, selection, language)
    services/         # generic loader, validation, distance/date utils, RoutingService, network graph
    modules/
      companies/      # schema, types, service, selectors (+ *.test.ts)
      activities/
      events/
      trails/         # GeoJSON LineStrings, length/difficulty, surface
  web/
    app/              # shell, routing, providers, layout
    map/              # MapCanvas, markers, layers, clustering, ConnectionLines, RouteOverlay
    ui/               # primitives: RippleButton, GlassCard, FilterChips
    i18n/             # fr.json, en.json, i18n setup
    adapters/         # browser implementations of core adapters
    modules/
      companies/      # marker, card, detail view
      activities/
      events/
      trails/
public/
  data/
    companies.json
    activities.json
    events.json
    trails.geojson
    company-links.json
```

A category registers itself through a small common contract. The core side provides id, schema, loader and filters. The web side provides label, icon, marker/layer renderer, and card and detail views. Adding a category should not require changes to other modules.

### Map defaults

- The map is centered on Saint-Jean-sur-Richelieu at `[45.3073, -73.2625]` (latitude, longitude; 73.2625° W).

### Data model principles

- Every record has an `id`, `category`, bilingual `name` and `description` (`{ fr, en }`), coordinates (`[lat, lng]`) or GeoJSON geometry, and a `lastVerified` date.
- Events also carry `startDate` and `endDate` in ISO 8601, America/Montreal time zone.
- Trails are GeoJSON `LineString`/`MultiLineString` features with `lengthKm`, `type` (`walk` | `bike` | `both`), `difficulty`, `surface` and an optional `network` (e.g. `route-verte`). A `both` trail appears in both the walking and biking layers.
- Companies have a `sector`. Industrial or tech parks are companies with `kind: "park"`.
- Company network links (`company-links.json`) contain `id`, `from`, `to` (company ids), `type` (`partner` | `supply` | `cluster`), `sector`, `source` (URL or citation) and `lastVerified`. Links without a source are rejected by validation.
- Events are split into **Upcoming** (end date on or after today) and **Recent** (ended within the last 30 days), both in the America/Montreal time zone.
- Every data file is validated with Zod at build time (in CI) and at load time (in development).
- Activities have a `subcategory`: `parks` | `culture` | `dining` | `outdoor`.
- Records can be marked `sample: true` for placeholder development data. Production builds exclude sample records, and a CI check fails the release build if any remain in the shipped data.

### Data source evolution

1. **MVP:** static JSON/GeoJSON shipped with the app. No backend.
2. **Later:** move to a headless CMS or Supabase/PostGIS behind the same loader interface, so the UI modules don't change.

## Constraints and budgets

- **Performance:** initial JS bundle under ~200 KB gzipped. Lazy-load each module's detail views. Cluster markers when there are many points.
- **Accessibility:** WCAG 2.1 AA, with a list view equivalent to the map.
- **Browsers:** the last 2 versions of Safari iOS, Chrome Android, and desktop Chrome, Firefox, Safari and Edge.
- **Privacy:** no analytics cookies. If analytics are added later, they must be privacy-friendly and cookieless.
- **Map attribution:** "© OpenStreetMap contributors" must always be visible.
- **No API keys** in the MVP.
- **Routing requests** send only the two selected coordinates and the walk/bike profile. The user's own location is sent only after explicit consent.

## Visual style

- Use glass panels (translucent background with `backdrop-blur`) for overlays such as the drawer, cards and chips. Each panel needs a solid fallback background, and text on it must meet WCAG AA contrast.
- Give tappable controls tactile feedback, such as a ripple or splash effect, built with CSS and Tailwind.
- Every animation is turned off or reduced under `prefers-reduced-motion` (Tailwind's `motion-safe:`/`motion-reduce:` variants).
- No animation libraries. The bundle budget comes first.

## Conventions

- Spec-driven order: for each feature, write the types and the unit tests for the core services first, then build the UI.
- Functional components and hooks only.
- No hard-coded user-facing strings; everything goes through i18n.
- Use absolute imports via the `@/` alias.
- Co-locate tests with source (`*.test.ts(x)`). Every service and store in `src/core/` has unit tests.
