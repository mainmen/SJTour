# Phase 11: List View — Plan

This plan starts after the Phase 10 commit. The phase lands as **one commit**. See `requirements.md` and `validation.md`.

## 1. Module summaries

1.1 `Summary` on `WebCategoryModule`; `CompanySummary`, `ActivitySummary`, `EventSummary`, `TrailSummary`.

## 2. List page

2.1 `ListRoute.tsx` (lazy + `useFilterUrlSync`) replaces the placeholder route.
2.2 `ListPage.tsx`: chips, count status, category sections (loading / error / empty), items (link, summary, address, badges, Show on map), "no layer" state.
2.3 Selected item: `aria-current`, label, scroll into view.
2.4 i18n keys (`list.*`; `pages.list.placeholder` removed).

## 3. Tests

3.1 `ListPage.test.tsx`: groups and counts, sorting, summaries, past events, chips + URL, shared link (both trail once), no layer, detail links, Show on map, selection highlight, error + Retry, English.

## 4. Wrap-up

4.1 Tick Phase 11 in `specs/roadmap.md`; `npm run ci`; commit `feat: add accessible list view synced with the map (Phase 11)`.
4.2 Push the branch and open one PR for Phases 8–11 with the bundle sizes.
