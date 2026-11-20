# Phase 13: MVP Polish and Release — Plan

This plan starts from `main` after the Phase 12 merge. The phase lands as **one commit**. See `requirements.md` and `validation.md`.

## 1. Core (tests first)

1.1 `src/core/map/cluster.ts`: Web Mercator projection, `clusterPoints`, `CLUSTER_RADIUS_PX`, `CLUSTER_MAX_ZOOM`; `cluster.test.ts`.

## 2. Web

2.1 `ClusterMarker` (badge, label, zoom in, focus the first member) and its CSS.
2.2 `CategoryMarkers`: track the zoom, cluster per category, keep the selected record apart (one keyed array).
2.3 `MapStatus` on the map (loading, no layers, search, empty); i18n.
2.4 `AppLayout`: skip link, per-route titles (`handle.titleKey`), focus after navigation; `routes.ts` handles.
2.5 About page content; i18n.
2.6 `App.tsx` router `basename`; `vite.config.ts` `base` from `BASE_PATH`.

## 3. Release tooling

3.1 `scripts/check-release.ts`, `scripts/check-bundle.ts`, `scripts/scripts.node.test.ts`; `tsconfig.node.json`, ESLint node globals.
3.2 `package.json`: `check:release`, `check:bundle`, `ci` runs the bundle check; CI workflow step.
3.3 `.github/workflows/deploy.yml` (manual GitHub Pages); README "Deploying".

## 4. Tests

4.1 `clusters.test.tsx`: badge, tap and Enter split, selected record stays apart; map status states.
4.2 `a11y.test.tsx`: skip link, titles (language, navigation, detail), focus after navigation.
4.3 Existing marker tests: zero cluster radius; LanguageToggle tab order.

## 5. Wrap-up

5.1 Tick the Phase 13 items done in `specs/roadmap.md` (data, deploy and the manual screen-reader pass stay open); tick Phase 12's PR boxes.
5.2 `npm run ci`; commit `feat: add clustering, map states, a11y pass and release tooling (Phase 13)`.
5.3 Push and open the PR with sizes.
