# Phase 2: Internationalization — Plan

Each task group ends with `npm run ci` passing. Nothing is committed until the end: the phase lands as **one commit** (D8). See `requirements.md` for scope and decisions, and `validation.md` for the merge criteria.

## 0. Baseline

0.1 Run `npm run build` on `main` (`2a3a0b7`) and record the gzipped JS size.

## 1. Spec and Phase 1b follow-up

1.1 Add this spec (`specs/2026-11-19-i18n/`) and the Phase 3 spec (`specs/2026-11-19-base-map/`). Both are committed with Phase 2, because they were written together.
1.2 Tick "The CI run on the pull request is green" in `specs/2026-11-19-ui-primitives/validation.md` (PR #4 merged green).

## 2. Core language logic

2.1 Add `src/core/i18n/language.ts` with `Language`, `SUPPORTED_LANGUAGES`, `DEFAULT_LANGUAGE = 'fr'`, `isLanguage(value)` and `resolveInitialLanguage(saved, browserLanguages)` (D2).
2.2 Add `i18next` and `react-i18next` to the core boundary lint rule, with cases in `boundary.lint.test.ts`.
2.3 Write `language.test.ts`, covering: a saved value wins; an invalid saved value is ignored; `en-CA` gives `en`; `fr-CA` gives `fr`; `['de', 'en-US']` gives `en`; an empty list gives `fr`; matching is case-insensitive.

## 3. Storage adapter

3.1 Add `src/web/adapters/languageStorage.ts`, with `loadLanguage(): Language | null` and `saveLanguage(lang)`. Both catch storage errors, and the key is namespaced (`stjeantour.language`).
3.2 Write tests: a value survives a round trip; garbage gives `null`; a `localStorage` that throws gives `null` and does not throw.

## 4. i18next setup

4.1 Install `i18next` and `react-i18next` (exact versions in `package-lock.json`).
4.2 Create `src/web/i18n/fr.json` and `en.json` from `strings.ts`, and add `language.switchTo` and `language.code` keys.
4.3 Add `src/web/i18n/i18next.d.ts` (module augmentation, with `fr.json` as the resource type) (D4).
4.4 Add `src/web/i18n/index.ts`. It initializes i18next synchronously with the bundled resources (D5), and its `languageChanged` handler sets `document.documentElement.lang` (D6). It exports `chooseLanguage(lang)`, which saves the choice and then switches (D9).
4.5 Add `resolveJsonModule` to `tsconfig.app.json`. Import the setup in `src/main.tsx` and in `src/test/setup.ts` (DOM tests only). Tests force `fr` before test modules load and before each test, and reset `<html lang>` and storage between tests (D7).
4.6 Write `src/web/i18n/resources.test.ts`. It checks that both files have the same flattened key set and that every value is a non-empty string.

## 5. Migrate the shell

5.1 Switch `Header`, `BottomNav`, the pages and `NotFoundPage` from `strings` to `useTranslation()`.
5.2 Update the existing tests so they find text through `i18n.t(...)` or by role. Their assertions keep the same meaning.
5.3 Delete `src/web/app/strings.ts` and confirm with grep that nothing still references it.

## 6. Language toggle

6.1 Build `src/web/app/LanguageToggle.tsx` on `RippleButton` (D3). It shows the target code, sets `aria-label` to the target-language label, and sets `lang` to the target language.
6.2 Place it at the right of the header next to the `h1`, keeping the safe-area padding and the 44 × 44 px target.
6.3 Write tests: in `fr` the button says "EN" with the label "Switch to English"; clicking it switches the nav labels to English, sets `<html lang="en">` and saves `en`; clicking again switches back.

## 7. Wrap-up

7.1 Run `npm run build` and record the new gzipped size next to the baseline.
7.2 Work through `validation.md`.
7.3 Tick off Phase 2 in `specs/roadmap.md`.
7.4 Run `npm run ci`, then make the phase commit: `feat: add react-i18next with fr/en and a language toggle (Phase 2)`.
