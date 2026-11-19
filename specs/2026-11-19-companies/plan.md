# Phase 5: Companies Module — Plan

This plan starts after the Phase 4 commit. The phase lands as **one commit** (D6). See `requirements.md` and `validation.md`.

## 1. Core (types and tests first)

1.1 Add `src/core/modules/companies/schema.ts` (`SECTORS`, `COMPANY_KINDS`, `companySchema`, `Company`).
1.2 Add `module.ts`, `selectors.ts` and `src/core/services/sort.ts`.
1.3 Add `src/core/services/dates.ts` with `formatDate(isoDate, language)` for the "last verified" date (Phase 7 extends this file).
1.4 Write `schema.test.ts`, `selectors.test.ts` and `sort.test.ts` (French collation: "École" sorts with "E") and `dates.test.ts`.
1.5 Register the module in `src/core/modules/registry.ts`.

## 2. Seed data

2.1 Write `public/data/companies.json` (6 sample records, 2 parks).
2.2 The build-time data test validates it; add a check that at least one record is a park.

## 3. Web contract and module

3.1 Add `src/web/modules/types.ts` and `registry.ts`.
3.2 Add `src/web/modules/companies/` (`CompanyCard.tsx`, `index.ts`) and the shared card parts in `src/web/modules/shared/` (`CardHeader`, `Badge`, `RecordMeta` with address, website, last verified and the sample badge).
3.3 Add the i18n keys to `fr.json` and `en.json`.

## 4. Markers

4.1 Add `src/web/map/PoiMarker.tsx` (`divIcon`, portal icon, accessible name, Enter/Space, selected style) and `CategoryMarkers.tsx`.
4.2 Add the marker and sheet styles to `map.css` (tones per category, selected ring, focus ring, reduced motion).
4.3 Add `src/web/map/useRevealSelection.ts` (D4).

## 5. Bottom sheet

5.1 Add `src/web/map/BottomSheet.tsx` (dialog, Escape, focus in and back, `ResizeObserver` offset).
5.2 Add `src/web/map/useSelectedRecord.ts` (selection + catalog → record and module).
5.3 Add `src/web/map/LoadErrors.tsx` (alert + Retry).
5.4 Update `MapPage` to load the modules and render markers, the sheet and the alert.

## 6. Tests

6.1 `PoiMarker`/`CategoryMarkers` tests (count, names, Enter, selected state).
6.2 `MapPage` integration test with a fake JSON source: markers appear, click opens the sheet, Escape closes it and focus returns, a failing category shows the alert and Retry recovers.
6.3 `CompanyCard` test: badges, address, website link, formatted date in both languages, sample badge.

## 7. Wrap-up

7.1 Record the gzipped sizes (main and map chunk).
7.2 Work through `validation.md`; manual check in headless Edge (360 × 640 and 1280 × 800).
7.3 Tick off Phase 5 in `specs/roadmap.md`.
7.4 Run `npm run ci`, then commit: `feat: add companies module with markers and bottom-sheet card (Phase 5)`.
