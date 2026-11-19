# Phase 10: Detail View — Plan

This plan starts after the Phase 9 commit. The phase lands as **one commit**. See `requirements.md` and `validation.md`.

## 1. Core (tests first)

1.1 `src/core/services/directions.ts` + `directions.test.ts` (provider detection, Google and Apple links, rounding).

## 2. Web plumbing

2.1 `src/web/adapters/share.ts` (share sheet → clipboard), `documentTitle.ts`.
2.2 `src/web/app/paths.ts` (`recordPath`), `src/web/state/useShowOnMap.ts`; the events page uses it.

## 3. Detail page

3.1 `DetailPage.tsx` (lazy, through `DetailRoute.tsx`); route `:category/:id`.
3.2 Back, header, actions (Directions, Show on map, Share), status line, card; loading, error and not-found states.

## 4. Entry points

4.1 "Full details" link in the bottom sheet (map tests render inside a router).
4.2 Event names link to their page.

## 5. Tests and wrap-up

5.1 `DetailPage.test.tsx`: deep links (company, trail), directions (Google, Apple), share and copy, Show on map with a hidden layer, not found, unknown category, error + Retry, Back, entry from the map card and the events list.
5.2 Tick Phase 10 in `specs/roadmap.md`; `npm run ci`; commit `feat: add shareable detail page with directions hand-off (Phase 10)`.
