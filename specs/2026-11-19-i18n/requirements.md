# Phase 2: Internationalization — Requirements

- **Branch:** `feature/i18n-base-map` (based on `main` after Phase 1b merged in PR #4). This branch is shared with Phase 3. Each phase gets its own commit, and both go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 2
- **Guidance:** `specs/tech-stack.md` (i18n row, layer rules, "No hard-coded user-facing strings")

## Context

Right now every shell string lives in `src/web/app/strings.ts`, in French only. This phase replaces that file with react-i18next using `fr` (the default) and `en`. It also adds a language toggle in the header and saves the user's choice locally.

## Scope

### In scope

1. **Dependencies:** `i18next` and `react-i18next`. The language detector plugin is not used (D4).
2. **Translation files:** `src/web/i18n/fr.json` and `src/web/i18n/en.json`. They hold every string currently in `strings.ts`, plus the new toggle strings.
3. **Typed keys:** TypeScript module augmentation (`CustomTypeOptions`) with `fr.json` as the source of the resource type, so a wrong key in `t('…')` fails the typecheck.
4. **Language logic in core:** a `Language = 'fr' | 'en'` type and a pure `resolveInitialLanguage(saved, browserLanguages)` function in `src/core/i18n/language.ts`. It has no browser globals and comes with unit tests.
5. **Storage adapter:** `src/web/adapters/languageStorage.ts`. It reads and writes the choice in `localStorage` and wraps each call in try/catch, so private mode or a blocked storage area cannot crash the app. Invalid saved values are ignored.
6. **i18n setup:** `src/web/i18n/index.ts` initializes i18next with the resolved language and `fallbackLng: 'fr'`. Whenever the language changes, it updates `<html lang>`. A `chooseLanguage(lang)` helper switches the language and saves it; only an explicit choice is saved, so a language detected from the browser can still follow the browser on later visits.
7. **Language toggle:** a `LanguageToggle` component in the header, built on `RippleButton`. It shows the other language's code ("EN" or "FR"), has an accessible name in the target language ("Switch to English" / "Passer au français"), and carries `lang` on that label.
8. **Migration:** every component that uses `strings` switches to `useTranslation()`, and `strings.ts` is deleted.
9. **Tests:** the core resolver, the storage adapter, a check that `fr.json` and `en.json` have exactly the same keys with no empty values, the toggle (switches language, saves it, updates `<html lang>`), and the existing shell tests running against the French translations.

### Out of scope (later phases)

- The Zustand language store (Phase 4). This phase keeps the language in i18next. Phase 4 can move the source of truth into the core store behind the same adapter.
- Locale date and number formatting (Phase 7).
- Translating content data such as bilingual records (Phase 4 onward).
- Language in the URL (for example `/en/...`).
- Map strings (Phase 3 adds its keys to these files).

## Decisions

| #   | Decision                                                                                                                                                                 | Rationale                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| D1  | **Phases 2 and 3 share the branch `feature/i18n-base-map`**, with one commit per phase and one PR.                                                                       | The user's choice. Each phase can still be reviewed as its own commit.                                           |
| D2  | **First-visit language:** a saved choice always wins. Otherwise use the first entry in `navigator.languages` whose primary subtag is `fr` or `en`. Otherwise use `fr`.   | English-speaking visitors get English right away, and French stays the default.                                  |
| D3  | **Toggle is a header button** (a `RippleButton`) that shows the other language's code and has a full accessible label in that language.                                  | It can always be reached, it takes little space, and screen readers announce it correctly.                       |
| D4  | **JSON files, typed keys and a hand-written `localStorage` adapter.** No `i18next-browser-languagedetector`.                                                             | Fewer dependencies. Detection is a tiny pure function, so it can live in core and be tested.                     |
| D5  | **Initialize synchronously with resources bundled** (no HTTP backend, no Suspense).                                                                                      | Two small files. There is no flash of untranslated text or loading state.                                        |
| D6  | **`<html lang>` follows the active language.** `index.html` defaults to `fr`.                                                                                            | Screen-reader pronunciation and WCAG 3.1.1.                                                                      |
| D7  | **Tests run in French**: the test setup initializes i18n with `fr`. Tests look elements up by their translated text through `i18n.t`, or by role.                        | Existing tests keep their meaning, and the default language is the one being tested.                             |
| D8  | **One commit for this phase**, made once `npm run ci` is green. It includes this spec and ticks "PR CI green" in `specs/2026-11-19-ui-primitives/validation.md` (PR #4). | Keeps the one-commit-per-phase rule.                                                                             |
| D9  | **Only an explicit choice is saved.** The toggle calls `chooseLanguage`, which saves before switching; a detected language is never written to storage.                  | A visitor whose browser language changes later still gets the matching language, until they pick one themselves. |

## Constraints

- No user-facing strings outside `src/web/i18n/*.json`. `strings.ts` no longer exists.
- `src/core/` stays free of i18next, React and browser globals. The boundary lint rule now also forbids `i18next` and `react-i18next` in core, and it still passes.
- The toggle is at least 44 × 44 px, keyboard operable, and has a visible focus ring. Its text meets AA on the glass header.
- The header layout does not shift or overflow at 360 px wide.
- Record the gzipped JS size before and after this phase (i18next adds roughly 15 KB gzipped). It stays well under the ~200 KB budget.
