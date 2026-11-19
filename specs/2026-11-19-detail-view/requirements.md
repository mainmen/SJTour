# Phase 10: Detail View — Requirements

- **Branch:** `feature/trails-filters-views`, committed on top of the Phase 9 commit. Phases 8–11 go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 10
- **Guidance:** `specs/tech-stack.md` (lazy-load detail views; no API keys; privacy), `specs/mission.md` (Getting around: guidance handed off to the device's maps app)

## Context

The bottom sheet is a quick look. A record also needs a full page with its own URL, so it can be shared and opened straight from a link, and a "Directions" button that hands off to the phone's maps app.

## Scope

### In scope

1. **Route** `/:category/:id` (lazy chunk, `DetailRoute`): static routes (`/events`, `/list`, `/about`) win over it, so `/events/<id>` is an event's page. An unknown category shows the not-found page; an unknown id shows "Place not found" with a link home.
2. **Detail page:** Back (history back, or the map when opened from a link), category label and icon, the name as the page's `h2`, the module's `Card` (full info: badges, description, dates or trail facts, address, website, last verified), and three actions: **Directions**, **Show on map**, **Share**. Loading and error (Retry) states. `document.title` names the record.
3. **Directions** (`src/core/services/directions.ts`): `detectMapsProvider(userAgent)` (Apple devices → Apple Maps, others → Google Maps) and `directionsUrl(destination, provider)`: a universal `https` link with only the destination (6 decimals), opened in a new tab. Trails use their trailhead.
4. **Share** (`src/web/adapters/share.ts`): the system share sheet when available, otherwise copy the URL to the clipboard, with a polite status message ("Link copied", or the URL when both fail). Cancelling the share sheet shows nothing.
5. **Show on map** (`useShowOnMap`, shared with the events page): switches the record's layers back on if they are all hidden, selects it as from a list and opens the map.
6. **Entry points:** a "Full details" link in the bottom sheet; event names in the events list link to their page.
7. **i18n:** every new label, status and title.

### Out of scope

- Route previews (Phase 20), maps inside the detail page, per-module custom detail layouts (the card is the full info for now), SPA fallback configuration on the host (Phase 13 deploy; `vite preview` already serves `index.html` for deep links).

## Decisions

| #   | Decision                                                                                                                      | Rationale                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| D1  | **`/:category/:id` with the category id in the path** (`/trails/piste-du-canal-de-chambly`).                                  | Readable, stable, shareable; ids are already slugs.                                             |
| D2  | **Universal https links, not `geo:` or app schemes.** Apple Maps on Apple devices, Google Maps elsewhere; no travel mode set. | Open the native app when installed and the website otherwise; no keys; the user picks the mode. |
| D3  | **Only the destination goes in the link.**                                                                                    | Privacy principle: the user's location stays on the device.                                     |
| D4  | **The card is the detail body**; modules can add a richer view later.                                                         | No duplicated layouts; the card already shows every field.                                      |
| D5  | **Show on map re-enables hidden layers** of the record.                                                                       | Otherwise the action would land on a map without the record.                                    |
| D6  | **Detail page in its own lazy chunk.**                                                                                        | `specs/tech-stack.md` → lazy-load detail views.                                                 |
| D7  | **One commit for this phase.**                                                                                                | The one-commit-per-phase rule.                                                                  |
