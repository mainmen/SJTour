# Phase 0: Project Foundation — Validation

The branch `feature/project-foundation` can merge into `main` only when every box below is checked.

## 1. Automated checks (local, from a clean install)

Run `rm -rf node_modules dist && npm ci`. Then each of these must exit with code 0:

- [ ] `npm run format:check`: no files need formatting
- [ ] `npm run lint`: 0 errors, 0 warnings
- [ ] `npm run typecheck`: no TypeScript errors, with strict mode on
- [ ] `npm run test`: all tests pass, including the App smoke test
- [ ] `npm run build`: it produces `dist/` with no errors or warnings
- [ ] `npm run ci`: runs all of the above in order and passes

## 2. Continuous integration

- [ ] `.github/workflows/ci.yml` exists and runs on `push` and `pull_request` to `main` using Node 24
- [ ] The workflow runs, in order: `npm ci`, `format:check`, `lint`, `typecheck`, `test`, `build`
- [ ] The CI run on the pull request is green. If no GitHub remote exists yet, note this as a known gap in the PR or merge notes, and confirm that `npm run ci` passes locally.

## 3. Configuration correctness

- [ ] `tsconfig` has `strict: true`
- [ ] The `@/` alias resolves in the app code, in the build and in Vitest (the smoke test imports through `@/`)
- [ ] `react` and `react-dom` resolve to 18.x (`npm ls react react-dom`)
- [ ] `.nvmrc` contains `24`, and `package.json` `engines.node` is `>=24`
- [ ] Tailwind v4 is set up via `@tailwindcss/vite`, with no `tailwind.config.js` or `postcss.config.js`
- [ ] ESLint uses the flat config, and `eslint-config-prettier` is applied
- [ ] `package-lock.json` is committed

## 4. Smoke test (Vitest + RTL)

- [ ] `src/App.test.tsx` renders `<App />` and asserts the "StJeanTour" heading is in the document
- [ ] If the heading is broken on purpose, the test fails (check this once, then revert)

## 5. Tailwind is working

- [ ] The Tailwind utility classes used in `App.tsx` appear in the built CSS in `dist/assets/*.css`
- [ ] Changing a utility class (e.g. a text color) in dev mode updates the page through HMR

## 6. Manual check (dev server, phone width)

Run `npm run dev` and open the app in browser devtools with a 375 × 667 viewport:

- [ ] The page renders the "StJeanTour" heading styled by Tailwind
- [ ] There is no horizontal scroll, and the viewport meta tag is correct (no zoom-out on mobile)
- [ ] `<html lang="fr">` and `<title>StJeanTour</title>` are present
- [ ] The browser console shows no errors or warnings
- [ ] No template leftovers are visible (Vite/React logos, counter demo)

## 7. Performance baseline

- [ ] Record the gzipped JS size reported by `npm run build` in the PR description as the baseline. It should be well under the ~200 KB budget.

## 8. Scope and hygiene

- [ ] The only runtime dependencies are `react` and `react-dom`
- [ ] No map, i18n, routing or content code is included (those belong to later phases)
- [ ] No secrets, API keys or tracking
- [ ] There is one commit per task group in `plan.md`, with conventional commit messages
- [ ] `README.md` lists the prerequisites and the scripts
- [ ] Phase 0 is checked off in `specs/roadmap.md`
