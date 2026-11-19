# StJeanTour — Tech Stack

## Summary

| Concern | Choice |
|---|---|
| Language | TypeScript (strict mode) |
| UI framework | React 18 |
| Build tool / dev server | Vite |
| Styling | Tailwind CSS (mobile-first breakpoints) |
| Map | Leaflet + react-leaflet |
| Map tiles | OpenStreetMap raster tiles, with attribution |
| Routing | React Router (hash- or history-based SPA routes) |
| i18n | react-i18next (`fr` default, `en`) |
| Data (MVP) | Static JSON + GeoJSON files in the repo |
| Validation | Zod schemas for all content files |
| State | React state + context; URL query params for filters |
| PWA / offline | vite-plugin-pwa (Workbox), in a later phase |
| Testing | Vitest + React Testing Library; Playwright for E2E |
| Linting / format | ESLint + Prettier |
| Package manager | npm |
| Hosting | Static hosting (e.g. Netlify, Vercel or GitHub Pages) |

## Architecture

### Modular by category

Each content category is a self-contained feature module:

```
src/
  app/                # shell, routing, providers, layout
  map/                # shared map component, markers, layers, clustering
  shared/             # UI primitives, hooks, utils, types
  i18n/               # fr.json, en.json, i18n setup
  modules/
    companies/        # schema, loader, marker, card, detail, filters
    activities/
    events/
    trails/           # GeoJSON LineStrings, distance/difficulty, surface
public/
  data/
    companies.json
    activities.json
    events.json
    trails.geojson
```

A module registers itself with the map shell through a small common interface: id, label, icon, loader, marker/layer renderer, card and detail views, and filters. Adding a category should not require changes to other modules.

### Data model principles

- Every record has an `id`, `category`, bilingual `name` and `description` (`{ fr, en }`), coordinates (`[lat, lng]`) or GeoJSON geometry, and a `lastVerified` date.
- Events also carry `startDate` and `endDate` in ISO 8601, America/Montreal time zone.
- Trails are GeoJSON `LineString`/`MultiLineString` features with `lengthKm`, `type` (`walk` | `bike` | `both`), `difficulty` and `surface`.
- Every data file is validated with Zod at build time (in CI) and at load time (in development).

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

## Conventions

- Functional components and hooks only.
- No hard-coded user-facing strings; everything goes through i18n.
- Use absolute imports via the `@/` alias.
- Co-locate tests with source (`*.test.ts(x)`).
