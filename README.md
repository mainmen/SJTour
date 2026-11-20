# StJeanTour

A mobile-first, bilingual (French/English) map of Saint-Jean-sur-Richelieu: companies, activities, events and walking and cycling trails. It's a static single-page app built with React, TypeScript and Vite.

## Prerequisites

- Node.js 24 or newer (`nvm use` picks up the version in `.nvmrc`)
- npm (comes with Node)

## Getting started

```sh
npm ci
npm run dev
```

## Scripts

| Script                  | What it does                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                                                               |
| `npm run build`         | Typecheck, then build for production into `dist/`                                       |
| `npm run preview`       | Serve the production build                                                              |
| `npm run lint`          | Run ESLint with zero warnings allowed                                                   |
| `npm run typecheck`     | Run the TypeScript compiler without emitting files                                      |
| `npm run format`        | Format every file with Prettier                                                         |
| `npm run format:check`  | Check formatting without changing files                                                 |
| `npm test`              | Run the unit tests once (Vitest)                                                        |
| `npm run test:watch`    | Run the unit tests in watch mode                                                        |
| `npm run ci`            | Run the same checks as CI: format, lint, typecheck, test, build, then the bundle budget |
| `npm run check:bundle`  | Fail if the home page's JavaScript is over 200 kB gzipped (after a build)               |
| `npm run check:release` | Fail while any `sample: true` record remains in `public/data`                           |

## Deploying

The app deploys to GitHub Pages with the **Deploy** workflow (`.github/workflows/deploy.yml`). It runs only when started by hand:

1. In the repository settings, under **Pages**, set the source to **GitHub Actions** (once).
2. Replace every `sample: true` record in `public/data/` with real, verified entries. The workflow's release check fails until none remain.
3. In the **Actions** tab, run **Deploy** on `main`.

The build is served from `/<repository name>/` (`BASE_PATH`), and `404.html` is a copy of `index.html` so deep links work.

## Project docs

The mission, tech stack, roadmap and per-phase specs are in [`specs/`](specs/).
