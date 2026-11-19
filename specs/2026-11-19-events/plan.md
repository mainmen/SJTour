# Phase 7: Events Module — Plan

This plan starts after the Phase 6 commit. The phase lands as **one commit** (D7). See `requirements.md` and `validation.md`.

## 1. Date utilities (core, tests first)

1.1 Extend `src/core/services/dates.ts` (Phase 5 added `formatDate`) and `dates.test.ts`: calendar date in Montreal, day differences, `formatDateRange` in `fr` and `en`, same-day and multi-day ranges, all-day events.

## 2. Events core

2.1 Add `src/core/modules/events/schema.ts`, `selectors.ts`, `module.ts` and register the module.
2.2 Write `schema.test.ts` (offset required, end before start rejected) and `selectors.test.ts` (the boundaries in requirements 2).

## 3. Seed data

3.1 Write `public/data/events.json` (6 sample records with offsets).
3.2 Extend the build-time data test: every event validates and has an offset.

## 4. Web module

4.1 Add `src/web/modules/events/` (`EventCard.tsx`, `index.ts`) and register it; add the tone and i18n keys.
4.2 `CategoryMarkers` uses `visibleOnMap` when the module has one.

## 5. Events page

5.1 Add `src/web/app/pages/EventsPage.tsx` (lazy, through `EventsRoute.tsx`), `src/web/ui/Tabs.tsx` (accessible tablist) and `src/web/modules/events/EventList.tsx`.
5.2 Add the `/events` route and the nav item; update the layout and routing tests for four nav links.
5.3 "Show on map": `select({ category: 'events', id, origin: 'list' })`, then `navigate('/')`.

## 6. Tests

6.1 `Tabs` keyboard test; `EventsPage` tests (Upcoming default, switch to Recent, empty message, Show on map → `/` with the card open).
6.2 `EventCard` test in both languages.

## 7. Wrap-up

7.1 Record the gzipped sizes (main, map chunk, events chunk).
7.2 Work through `validation.md`; manual check in headless Edge.
7.3 Tick off Phase 7 in `specs/roadmap.md`.
7.4 Run `npm run ci`, commit: `feat: add events module with Upcoming/Recent list (Phase 7)`.
7.5 Push the branch and open one PR covering Phases 4–7.
