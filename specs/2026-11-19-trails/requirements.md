# Phase 8: Trails Module — Requirements

- **Branch:** `feature/trails-filters-views`, from `main` after PR #6. Phases 8–11 go out in one PR, one commit per phase.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 8
- **Guidance:** `specs/tech-stack.md` (Data model principles: trails), `specs/mission.md` (Content categories → Trails)

## Context

Trails are the first category drawn as shapes instead of points. They come from a GeoJSON file, need a walking layer and a biking layer (a `both` trail belongs to each), and a card with length, difficulty and surface.

## Scope

### In scope

1. **Core geo utilities** `src/core/services/geo.ts`: `distanceKm` (haversine), `pathLengthKm`, `boundsOf`; `formatKm` in `src/core/services/units.ts` (`Intl.NumberFormat`, `fr-CA` / `en-CA`).
2. **Module contract** (`CoreCategoryModule`): optional `fileSchema` (turns a whole data file into raw records before per-record validation) and optional `extentOf(record)` (the area a shape covers). `validateCollection` applies `fileSchema` first.
3. **Core module** `src/core/modules/trails/`:
   - `schema.ts`: base + `geometry` (`LineString` | `MultiLineString`, positions `[lng, lat]` inside `MAX_BOUNDS`), `lengthKm` (> 0), `type` (`walk` | `bike` | `both`), `difficulty` (`easy` | `moderate` | `difficult`), `surface` (`paved` | `gravel` | `dirt` | `boardwalk` | `mixed`), optional `network` (`route-verte`).
   - `geojson.ts`: a FeatureCollection → records (`properties` + `geometry`, `coordinates` = trailhead).
   - `selectors.ts`: `TRAIL_LAYERS` (`walking`, `biking`), `isInTrailLayer`, `trailsInLayer`, `layersOfTrail`, `trailLines` (`[lat, lng]`), `trailExtent`, `geometryLengthKm`.
4. **Seed data** `public/data/trails.geojson`: 3 trails, all `sample: true`: the Chambly Canal path on La Route verte (`both`), a sample bike path (`bike`) and a sample riverside promenade (`walk`). Geometries are approximate and say so.
5. **Web module** `src/web/modules/trails/`: `RouteIcon`, tone `trails`, `TrailCard` (type and network badges; length, difficulty and surface as a description list) and a map `Overlay` (`TrailLines`) drawing a biking layer (solid) and a walking layer (dashed, on top).
6. **Map:** trail lines are tappable and open the card; a trailhead marker per trail gives keyboard and screen-reader access. "Show on map" for a trail fits its whole path.
7. **i18n:** trail facts, types, difficulties, surfaces, network.

### Out of scope

- Layer toggles (Phase 9), elevation, GPX and points of interest (Phase 18), offline trail data (Phase 17).

## Decisions

| #   | Decision                                                                                                                         | Rationale                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| D1  | **The data file is real GeoJSON** (`FeatureCollection`), unwrapped by a module `fileSchema`; the loader stays generic.           | Standard tools (geojson.io, QGIS) can edit it; other modules keep plain arrays. |
| D2  | **`coordinates` is derived: the trailhead** (first position).                                                                    | Every record keeps one point for the marker, directions and list "Show on map". |
| D3  | **GeoJSON positions are validated inside `MAX_BOUNDS`**, so a `[lat, lng]` swap fails validation. Paths are clipped to the city. | The most common GeoJSON mistake; content is local-only.                         |
| D4  | **Walking is dashed, biking solid**, each its own colour (`--color-trail-*`, at least 3:1 on white).                             | Layers differ by pattern, not colour alone.                                     |
| D5  | **Trailhead markers** carry keyboard and screen-reader access; lines are pointer-only.                                           | SVG paths are not focusable; markers reuse the tested `PoiMarker`.              |
| D6  | **The stated `lengthKm` must be within 10 % of the drawn path** (data test).                                                     | Catches a wrong length or a broken geometry.                                    |
| D7  | **One commit for this phase**; one PR for Phases 8–11.                                                                           | The one-commit-per-phase rule; the user asked for one branch for Phases 8–11.   |
