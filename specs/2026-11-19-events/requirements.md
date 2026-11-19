# Phase 7: Events Module — Requirements

- **Branch:** `feature/content-modules`, committed on top of the Phase 6 commit. Phases 4–7 go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 7
- **Guidance:** `specs/tech-stack.md` (Data model principles: events, Upcoming/Recent), `specs/mission.md` (Content categories → Events)

## Context

Events are the first category with time. They need date logic in the America/Montreal time zone (Upcoming and Recent), locale-aware date display, and their own list page with tabs and a "Show on map" action that hands off to the map built in Phase 5.

## Scope

### In scope

1. **Date utilities in core** `src/core/services/dates.ts` (pure `Intl`, no browser globals):
   - `EVENT_TIME_ZONE = 'America/Montreal'`.
   - `calendarDateIn(instant, timeZone)` → `YYYY-MM-DD`, and `daysBetween(a, b)` for calendar dates.
   - `formatDate(isoDate, language)` for `lastVerified` (added in Phase 5; a calendar date, never shifted by time zone).
   - `formatDateRange(start, end, language)` for events: the date (and time when it isn't midnight) in Montreal time, `fr-CA` or `en-CA`, collapsing same-day ranges.
2. **Core module** `src/core/modules/events/`:
   - `schema.ts`: base + `startDate` and `endDate`, ISO 8601 date-times **with an explicit offset** (for example `2027-08-13T10:00:00-04:00`), and a refinement that `endDate` is not before `startDate`.
   - `selectors.ts`: `eventStatus(event, now)` → `upcoming` | `recent` | `past`; `selectUpcoming(events, now)` (end date, as a Montreal calendar date, on or after today; sorted by start, soonest first) and `selectRecent(events, now)` (ended 1–30 days ago; sorted by end, most recent first). `RECENT_WINDOW_DAYS = 30`.
   - `module.ts` with `visibleOnMap = upcoming + recent` (past events are not drawn).
   - Unit tests around the boundaries: ends today, ended yesterday, ended exactly 30 and 31 days ago, a late-evening event that is already "tomorrow" in UTC, and a DST change.
3. **Seed data** `public/data/events.json`: 6 records, all `sample: true`, with Montreal offsets: at least 3 upcoming, 2 recent and 1 past relative to the commit date (2026-11-19), including L'International de montgolfières (August).
4. **Web module** `src/web/modules/events/`: label, `CalendarDays` icon, tone and `EventCard` (status badge, formatted dates, shared card parts).
5. **Events page** `/events` (lazy route, new bottom-nav item "Events" / « Événements », D1): an `h2`, a tablist with **Upcoming** and **Recent** tabs (arrow keys, Home/End, `aria-selected`, roving tabindex), each tab panel a list of events (name, formatted dates, address) with a **Show on map** button. An empty tab shows a translated message; loading and error states reuse the catalog store.
6. **Show on map:** selects the event with `origin: 'list'` and navigates to `/`; the map zooms to the event (Phase 5 D4) and opens its card.
7. **i18n:** nav label, page title, tab names, empty messages, "Show on map", event statuses, date-related labels.
8. **Tests:** date utilities and selectors (core), the events page (tabs, keyboard, empty state, Show on map navigates and selects), `EventCard` in both languages.

### Out of scope

- Today / This weekend filters and a calendar view (Phase 15), recurring events, ICS export.

## Decisions

| #   | Decision                                                                                                                 | Rationale                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| D1  | **A dedicated `/events` route with a fourth nav item**, rather than a panel on the map.                                  | Residents' key task ("what's on this weekend") deserves one tap. `/list` stays for Phase 11. |
| D2  | **Upcoming/Recent compare Montreal calendar dates**, not instants: an event that ends tonight is still Upcoming all day. | Matches `tech-stack.md` ("end date on or after today", America/Montreal).                    |
| D3  | **Date strings must carry an offset.** A bare local time would be read in the device's zone, which differs for visitors. | Unambiguous instants; the schema rejects ambiguous input.                                    |
| D4  | **Date formatting lives in core** (`Intl.DateTimeFormat` with `fr-CA` / `en-CA` and `timeZone: 'America/Montreal'`).     | Pure, portable and testable; the native app can reuse it.                                    |
| D5  | **`now` is a parameter** of every selector; the web layer passes the current time.                                       | Deterministic tests, no hidden clock in core.                                                |
| D6  | **Past events (ended more than 30 days ago) are neither listed nor drawn.**                                              | They are stale for both audiences.                                                           |
| D7  | **One commit for this phase**, on top of the Phase 6 commit; then one PR for Phases 4–7.                                 | The one-commit-per-phase rule.                                                               |
