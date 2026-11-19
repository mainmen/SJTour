# Phase 0: Project Foundation — Plan

Each task group ends with every check available at that point passing, followed by one commit (decision D5). See `requirements.md` for scope and decisions and `validation.md` for the merge criteria.

## 1. Scaffold the Vite + React + TypeScript app
1.1 Scaffold the `react-ts` Vite template into the repository root, without overwriting `specs/`.
1.2 Pin `react` and `react-dom` to `^18` and their `@types` to match (D6), then run `npm install`.
1.3 Enable `strict: true` in the tsconfig files (confirm the template has it).
1.4 Add the `@/` → `src/` alias in `tsconfig.app.json` (`paths`) and `vite.config.ts` (`resolve.alias`).
1.5 Strip the template demo: replace `App.tsx` with a minimal placeholder that renders the heading "StJeanTour", and delete the demo assets and CSS.
1.6 Set up `index.html`: `lang="fr"`, the viewport meta tag, and the title `StJeanTour` (D7).
1.7 Add `.nvmrc` (`24`) and `"engines": { "node": ">=24" }` (D2), and check `.gitignore`.
1.8 Add the `typecheck` script. Check that `npm run dev`, `npm run build` and `npm run typecheck` work.
1.9 **Commit:** `chore: scaffold Vite + React + TypeScript app`

## 2. Linting and formatting
2.1 Configure ESLint with a flat config: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` (D8).
2.2 Install Prettier and `eslint-config-prettier`. Add `.prettierrc` and `.prettierignore` (ignoring `dist`, `coverage` and the lockfile).
2.3 Add the scripts `lint` (`--max-warnings 0`), `format` and `format:check`.
2.4 Run `npm run format` across the repo, then make `lint` and `format:check` pass.
2.5 **Commit:** `chore: add ESLint and Prettier`

## 3. Unit testing
3.1 Install `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` and `@testing-library/user-event`.
3.2 Configure the `test` block in `vite.config.ts`: `environment: 'jsdom'`, `globals: true`, and a `setupFiles` entry that points to `src/test/setup.ts` (which imports jest-dom).
3.3 Add `vitest/globals` and the jest-dom types to the tsconfig so test files typecheck.
3.4 Write `src/App.test.tsx`, a smoke test that renders `<App />` and finds the "StJeanTour" heading. Import it through the `@/` alias to prove the alias works in tests.
3.5 Add the scripts `test` (`vitest run`) and `test:watch` (`vitest`).
3.6 **Commit:** `test: add Vitest and React Testing Library with App smoke test`

## 4. Tailwind CSS v4
4.1 Install `tailwindcss` and `@tailwindcss/vite`, and register the plugin in `vite.config.ts` (D1).
4.2 Create `src/index.css` with `@import "tailwindcss";` and import it in `main.tsx`.
4.3 Add mobile-first base styles: full-height `html`, `body` and `#root`, a system font stack, and a `@theme` placeholder for brand tokens.
4.4 Style the placeholder `App` with Tailwind utilities (e.g. centered heading, padding) so the build visibly uses Tailwind.
4.5 Check that the built CSS contains the used utilities and that no template CSS remains.
4.6 **Commit:** `style: add Tailwind CSS v4 with mobile-first base styles`

## 5. Continuous integration and docs
5.1 Add `.github/workflows/ci.yml`. It runs on `push` and `pull_request` to `main` (D3), uses `ubuntu-latest` with `actions/setup-node` (Node 24 and the npm cache), and runs these steps in order: `npm ci` → `format:check` → `lint` → `typecheck` → `test` → `build`.
5.2 Add an `npm run ci` convenience script that runs the same checks locally, in the same order.
5.3 Write `README.md` with a short description, prerequisites (Node 24), the scripts table and a link to `specs/`.
5.4 Run `npm run ci` locally from a clean install (`rm -rf node_modules && npm ci`).
5.5 **Commit:** `ci: add GitHub Actions workflow and README`

## 6. Wrap-up
6.1 Work through every item in `validation.md`.
6.2 Tick off Phase 0 in `specs/roadmap.md`.
6.3 **Commit:** `docs: mark Phase 0 complete in roadmap`
