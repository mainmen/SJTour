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

| Script                 | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                            |
| `npm run build`        | Typecheck, then build for production into `dist/`                    |
| `npm run preview`      | Serve the production build                                           |
| `npm run lint`         | Run ESLint with zero warnings allowed                                |
| `npm run typecheck`    | Run the TypeScript compiler without emitting files                   |
| `npm run format`       | Format every file with Prettier                                      |
| `npm run format:check` | Check formatting without changing files                              |
| `npm test`             | Run the unit tests once (Vitest)                                     |
| `npm run test:watch`   | Run the unit tests in watch mode                                     |
| `npm run ci`           | Run the same checks as CI: format, lint, typecheck, test, then build |

## Project docs

The mission, tech stack, roadmap and per-phase specs are in [`specs/`](specs/).
