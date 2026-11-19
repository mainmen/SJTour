# Phase 2: Internationalization — Validation

The Phase 2 commit on `feature/i18n-base-map` is ready only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [x] `npm run format:check`
- [x] `npm run lint`: 0 errors, 0 warnings (including the core boundary rule)
- [x] `npm run typecheck`, where a misspelled translation key fails the typecheck (checked once by hand, then reverted)
- [x] `npm run test`: all tests pass
- [x] `npm run build`: no errors or warnings
- [x] `npm run ci` passes locally from a clean install
- [ ] The CI run on the pull request is green (pending: PR opens after Phase 3)

## 2. Translations

- [x] `fr.json` and `en.json` have identical key sets with no empty values (test)
- [x] `src/web/app/strings.ts` is deleted, and grep finds no remaining imports of it
- [x] grep finds no hard-coded user-facing strings in `src/web/` components

## 3. Language selection and persistence

- [x] Core tests for `resolveInitialLanguage` cover saved, browser `en`, browser `fr`, unsupported and empty
- [x] Adapter tests cover a round trip, invalid values, and a `localStorage` that throws
- [x] Manual: with `localStorage` cleared and the browser language set to English, the first load is in English; with German, it is in French (headless Edge, `--accept-lang` en-US → English, de-DE → French, fr-CA → French)
- [x] Manual: after toggling to English and reloading, the app is still in English (headless Edge: toggle → `html lang=en`, stored `en`, still English after reload)
- [ ] Manual: in a private window, toggling works and nothing throws (pending: needs an interactive browser; the adapter test covers a throwing `localStorage`)

## 4. Toggle and accessibility

- [x] Test: clicking the toggle switches the shell text, sets `<html lang>` and saves the choice
- [x] The toggle's accessible name is in the target language and carries a matching `lang` attribute
- [x] The toggle is at least 44 × 44 px, reachable by keyboard, and has a visible focus ring (measured 44 × 44 in headless Edge; keyboard test; focus ring from `pressableClass`)
- [x] The toggle text meets AA on the glass header (it uses the existing tokens)
- [ ] Manual: a screen reader (or the devtools accessibility tree) announces the toggle correctly (pending: needs an interactive browser; tests assert the accessible name and `lang`)

## 5. Manual mobile check (dev server)

- [x] **360 × 640:** the header fits the title and toggle with no overflow or horizontal scroll (headless Edge in a 360 × 640 iframe: scroll size 360 × 640)
- [x] The browser console shows no errors or warnings, including no i18next missing-key warnings (headless Edge console log on the production preview)

## 6. Bundle size

- [ ] The before and after gzipped JS sizes are recorded in the PR description (78.88 kB → 96.86 kB gzipped; goes in the PR after Phase 3)
- [x] The new size is well under the ~200 KB gzipped budget

## 7. Scope and hygiene

- [x] The only new runtime dependencies are `i18next` and `react-i18next`
- [x] `src/core/` imports no i18next, React or browser globals
- [x] No map, data or store code in this commit (Phase 3 and later)
- [x] "PR CI green" is ticked in `specs/2026-11-19-ui-primitives/validation.md`
- [x] The phase is a single commit with a conventional commit message
- [x] Phase 2 is checked off in `specs/roadmap.md`
