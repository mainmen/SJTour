# Phase 5: Companies Module — Requirements

- **Branch:** `feature/content-modules`, committed on top of the Phase 4 commit. Phases 4–7 go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 5
- **Guidance:** `specs/tech-stack.md` (Data model principles, Architecture, Visual style), `specs/mission.md` (Content categories → Companies)

## Context

Phase 4 defined the contracts. This phase ships the first real category end to end: a companies schema and service in core, a seeded data file, markers on the map, and a glass bottom-sheet card when a marker is tapped. The web pieces (marker layer, bottom sheet, module registry) are generic so Phases 6 and 7 only add a module.

## Scope

### In scope

1. **Core module** `src/core/modules/companies/`:
   - `schema.ts`: the base schema plus `sector` (`food`, `retail`, `services`, `manufacturing`, `technology`, `health`, `mixed`) and `kind` (`business` | `park`). Industrial and tech parks, and districts such as Vieux-Saint-Jean, are `kind: "park"`.
   - `module.ts`: the `CoreCategoryModule` (`dataFile: 'data/companies.json'`).
   - `selectors.ts`: `parks(companies)`, `bySector(companies, sector)` and `sortByName(records, language)` (generic, in `src/core/services/sort.ts`, locale-aware).
   - Unit tests for the schema, the selectors and the module loading through the Phase 4 loader.
2. **Seed data** `public/data/companies.json`: 6 entries, every one `sample: true`, including Parc industriel Iberville (`kind: "park"`) and Vieux-Saint-Jean (`kind: "park"`, `sector: "mixed"`). Business names are clearly placeholders (D3).
3. **Web module contract** `src/web/modules/`: `types.ts` (`WebCategoryModule<T>`, `CardProps<T>`), `registry.ts` (the ordered list of web modules), and `companies/` (presentation: label, `Building2` icon, tone, `CompanyCard`).
4. **Markers** `src/web/map/CategoryMarkers.tsx` and `PoiMarker.tsx`: one Leaflet marker per record, a 44 × 44 px `divIcon` pin with the category's Lucide icon (rendered into the marker with a portal) and a category colour, so the category is shown by shape and colour, never by colour alone. Each marker is a keyboard-focusable button (Leaflet `keyboard: true`) named after the record; Enter or Space selects it. The selected marker gets a visible "selected" style and `aria-pressed="true"`.
5. **Bottom sheet** `src/web/map/BottomSheet.tsx`: a `GlassCard` (`role="dialog"`, non-modal, labelled by the record name) docked above the bottom nav, inside the safe areas. It shows the module's card, a close button (`RippleButton`, 44 × 44 px), closes on Escape, moves focus to itself when it opens, and returns focus to the marker when it closes. While it is open, Leaflet's bottom controls and the attribution move up by its height, so "© OpenStreetMap contributors" stays visible.
6. **Company card** shows: the name (heading), kind and sector badges (text, not colour only), the description, the address, the website link (opens in a new tab with `rel="noopener noreferrer"`), the "Last verified" date formatted per locale, and a "Sample data" badge when `sample` is true.
7. **Map wiring:** `MapPage` loads every registered module through the catalog store, renders each one's markers, and renders the bottom sheet for the selected record. A failed category shows a small translated alert with a Retry button; the others still render.
8. **i18n:** category labels, sectors, kinds, card labels (last verified, website, address, sample data, close), the load-error alert.
9. **Tests:** marker count and names, Enter selects, the sheet opens with the right card, Escape and Close dismiss it and return focus, a load error shows the alert and Retry reloads.

### Out of scope

- Clustering (Phase 13), filters (Phase 9), the detail route and directions (Phase 10), the list view (Phase 11), the business network (Phase 19).

## Decisions

| #   | Decision                                                                                                                                                                                                                                       | Rationale                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| D1  | **`divIcon` pins with a portal-rendered Lucide icon** instead of Leaflet's default image marker.                                                                                                                                               | Avoids the default icon path bug under Vite, adds no image assets, and reuses the icon set the app already has. |
| D2  | **A non-modal dialog for the sheet**, not a modal: the map stays usable behind it.                                                                                                                                                             | Tapping another marker should switch the card directly.                                                         |
| D3  | **Placeholder business names** ("Boulangerie exemple"), real names only for public places named in `mission.md`. All coordinates are approximate and every record is `sample: true`.                                                           | Accuracy matters more than volume (principle 3): no invented facts about real businesses.                       |
| D4  | **Selecting a marker pans the map only if the marker is off-screen or would sit under the sheet; a list "Show on map" (origin `list`) zooms to it at zoom 16, centred above the sheet.** Under reduced motion the map moves without animation. | No surprise jumps on tap, and a clear reveal when coming from a list.                                           |
| D5  | **Leaflet's bottom controls follow the sheet** through a `--sheet-offset` CSS variable measured with `ResizeObserver`.                                                                                                                         | The OSM attribution must stay visible (tech-stack constraint).                                                  |
| D6  | **One commit for this phase**, on top of the Phase 4 commit.                                                                                                                                                                                   | The one-commit-per-phase rule.                                                                                  |

## Constraints

- Every marker and control is reachable by keyboard; markers have accessible names in the active language.
- Text on the sheet meets AA contrast on the glass token (existing token tests cover it).
- The map chunk stays lazy; the main chunk does not grow by Zod or the modules.
