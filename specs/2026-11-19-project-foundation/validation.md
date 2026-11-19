# Phase 0: Project Foundation — Validation

The branch `feature/project-foundation` can merge into `main` only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [x] `npm run format:check`: no files need formatting
- [x] `npm run lint`: 0 errors, 0 warnings
- [x] `npm run typecheck`: no TypeScript errors, with strict mode on
- [x] `npm run test`: all tests pass, including the App smoke test
- [x] `npm run build`: it produces `dist/` with no errors or warnings
- [x] `npm run ci`: runs all of the above in order and passes

## 2. Continuous integration

- [x] `.github/workflows/ci.yml` exists and runs on `push` and `pull_request` to `main` using Node 24
- [x] The workflow runs, in order: `npm ci`, `format:check`, `lint`, `typecheck`, `test`, `build`
- [ ] The CI run on the pull request is green. If no GitHub remote exists yet, note this as a known gap in the PR or merge notes, and confirm that `npm run ci` passes locally.

## 3. Configuration correctness

- [x] `tsconfig` has `strict: true`
- [x] The `@/` alias resolves in the app code, in the build and in Vitest (the smoke test imports through `@/`)
- [x] `react` and `react-dom` resolve to 18.x (`npm ls react react-dom`)
- [x] `.nvmrc` contains `24`, and `package.json` `engines.node` is `>=24`
- [x] Tailwind v4 is set up via `@tailwindcss/vite`, with no `tailwind.config.js` or `postcss.config.js`
- [x] ESLint uses the flat config, and `eslint-config-prettier` is applied
- [x] `package-lock.json` is committed

## 4. Smoke test (Vitest + RTL)

- [x] `src/App.test.tsx` renders `<App />` and asserts the "StJeanTour" heading is in the document
- [x] If the heading is broken on purpose, the test fails (check this once, then revert)

## 5. Tailwind is working

- [x] The Tailwind utility classes used in `App.tsx` appear in the built CSS in `dist/assets/*.css`
- [x] Changing a utility class (e.g. a text color) in dev mode updates the page through HMR

## 6. Manual check (dev server, phone width)

Run `npm run dev` and open the app in browser devtools with a 375 × 667 viewport:

- [ ] The page renders the "StJeanTour" heading styled by Tailwind
- [ ] There is no horizontal scroll, and the viewport meta tag is correct (no zoom-out on mobile)
- [x] `<html lang="fr">` and `<title>StJeanTour</title>` are present
- [ ] The browser console shows no errors or warnings
- [x] No template leftovers are visible (Vite/React logos, counter demo)

## 7. Performance baseline

- [ ] Record the gzipped JS size reported by `npm run build` in the PR description as the baseline. It should be well under the ~200 KB budget.

## 8. Scope and hygiene

- [x] The only runtime dependencies are `react` and `react-dom`
- [x] No map, i18n, routing or content code is included (those belong to later phases)
- [x] No secrets, API keys or tracking
- [x] There is one commit per task group in `plan.md`, with conventional commit messages
- [x] `README.md` lists the prerequisites and the scripts
- [x] Phase 0 is checked off in `specs/roadmap.md`
