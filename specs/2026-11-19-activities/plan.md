# Phase 6: Activities Module — Plan

This plan starts after the Phase 5 commit. The phase lands as **one commit** (D4). See `requirements.md` and `validation.md`.

## 1. Core

1.1 Add `src/core/modules/activities/schema.ts`, `module.ts` and `selectors.ts`.
1.2 Write `schema.test.ts` and `selectors.test.ts`.
1.3 Register the module in `src/core/modules/registry.ts`.

## 2. Seed data

2.1 Write `public/data/activities.json` (6 sample records, all four subcategories).
2.2 Extend the build-time data test: every subcategory appears at least once.

## 3. Web

3.1 Add `src/web/modules/activities/` (`ActivityCard.tsx`, `index.ts`) and register it.
3.2 Add the activity tone to `map.css` and the i18n keys.
3.3 Write `ActivityCard.test.tsx` and extend the `MapPage` test with an activity marker.

## 4. Wrap-up

4.1 Confirm with `git diff --stat` that only module folders, registries, styles, translations, data and tests changed.
4.2 Work through `validation.md`, tick off Phase 6 in `specs/roadmap.md`.
4.3 Run `npm run ci`, then commit: `feat: add activities module (Phase 6)`.
