# Phase 0: Project Foundation — Requirements

- **Branch:** `feature/project-foundation`
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 0
- **Guidance:** `specs/mission.md` and `specs/tech-stack.md`

## Context

StJeanTour is a mobile-first, bilingual (FR/EN) map SPA for Saint-Jean-sur-Richelieu. The repository currently holds only the `specs/` constitution. This phase creates the empty but production-ready skeleton that every later phase builds on. It should be fast, strictly typed, linted, formatted and tested, with CI verifying all of it automatically.

This phase ships no user-facing features: no map, no i18n, no routing and no content. Those arrive in Phases 1–4.

## Scope

### In scope
1. **Scaffold:** Vite + React 18 + TypeScript, at the repository root.
2. **TypeScript:** strict mode, plus the `@/` path alias mapped to `src/` in both `tsconfig` and Vite.
3. **Linting:** ESLint (flat config) with the TypeScript, React Hooks and React Refresh rules, and Prettier compatibility.
4. **Formatting:** Prettier, with a config file and an ignore file.
5. **Testing:** Vitest + React Testing Library + jsdom + `@testing-library/jest-dom`, with one smoke test.
6. **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, imported in `src/index.css`, plus mobile-first base styles. The Vite template's demo CSS and assets are removed.
7. **CI:** a GitHub Actions workflow that runs on push and pull requests to `main`.
8. **Project hygiene:** `.gitignore`, `.nvmrc`, an `engines` field, a minimal `README.md` with the scripts listed, and `index.html` with `lang="fr"`, a viewport meta tag and the title "StJeanTour".

### Out of scope (later phases)
- The app shell, layout and routing (Phase 1)
- i18n and the language toggle (Phase 2)
- Leaflet and the map (Phase 3)
- The module contract, Zod and data loaders (Phase 4)
- Playwright E2E, coverage thresholds, and PWA support
- Deployment and hosting

## Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is no `tailwind.config.js` or PostCSS config; theme tokens go in CSS with `@theme`. | This is the current major version. It's simpler to set up and builds faster. |
| D2 | **Node 24 LTS** is pinned in `.nvmrc` and `package.json` `engines` (`>=24`), and CI uses Node 24. | LTS is stable for CI and hosting. The local Node 26 still satisfies `>=24`. |
| D3 | **GitHub Actions** for CI, running on `push` and `pull_request` to `main`. | It's the standard choice and works with GitHub-based static hosting later. |
| D4 | **npm** is the package manager, and `package-lock.json` is committed. CI uses `npm ci`. | Per the tech stack. |
| D5 | **One commit per task group** in `plan.md`. Each commit leaves the repo in a green state. | Small, reviewable history. Any commit can be bisected. |
| D6 | **React 18** is pinned, even if the Vite template defaults to a newer major. | Per the tech stack. This avoids drift until we decide to upgrade on purpose. |
| D7 | `lang="fr"` on `<html>`. | French is the default language (mission). |
| D8 | ESLint uses the flat config (`eslint.config.js`), and `eslint-config-prettier` turns off stylistic rules. | Current ESLint standard. Prettier owns formatting. |

## Required npm scripts

| Script | Purpose |
|---|---|
| `dev` | Start the Vite dev server |
| `build` | Typecheck the project, then run the Vite production build |
| `preview` | Serve the production build |
| `lint` | Run ESLint on the repository with zero warnings allowed |
| `typecheck` | Run `tsc -b --noEmit` (or equivalent) |
| `format` | Run Prettier in write mode |
| `format:check` | Run Prettier in check mode |
| `test` | Run Vitest once (CI mode) |
| `test:watch` | Run Vitest in watch mode |

## Constraints

- No hard-coded user-facing strings beyond the placeholder title. i18n arrives in Phase 2.
- Keep the initial bundle small; this phase sets the baseline against the ~200 KB gzipped budget.
- No API keys, analytics or tracking.
- No runtime dependencies beyond `react` and `react-dom`.

## Open items

- A GitHub remote doesn't exist yet. The CI workflow will be committed now, but it can only be shown passing once the repo is pushed.
- The repo has no commits on `main` yet. Before opening the first PR, decide whether to commit `specs/` to `main` first.
