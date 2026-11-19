# Phase 6: Activities Module — Requirements

- **Branch:** `feature/content-modules`, committed on top of the Phase 5 commit. Phases 4–7 go out in one PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 6
- **Guidance:** `specs/tech-stack.md` (Data model principles: activity `subcategory`), `specs/mission.md` (Content categories → Activities)

## Context

Phase 5 built the generic marker layer, bottom sheet and module registry. This phase proves the contract: "Things to do" is added as a new module without changing the companies module or the map wiring beyond one registry line on each side.

## Scope

### In scope

1. **Core module** `src/core/modules/activities/`: `schema.ts` (base + `subcategory`: `parks` | `culture` | `dining` | `outdoor`), `module.ts`, `selectors.ts` (`bySubcategory`, `groupBySubcategory`), with unit tests.
2. **Seed data** `public/data/activities.json`: 6 records, all `sample: true`, covering all four subcategories, including the Musée du Haut-Richelieu (`culture`).
3. **Web module** `src/web/modules/activities/`: label "Things to do" / « Activités », the `Trees` icon, its own tone, and `ActivityCard` (subcategory badge plus the shared card parts).
4. **Registration:** one entry in `src/core/modules/registry.ts` and one in `src/web/modules/registry.ts`. No other file in the map layer changes (D1).
5. **i18n:** the category label and the four subcategory names.
6. **Tests:** schema and selectors; the build-time data test covers the new file; a map test shows activity markers next to company markers and opens an activity card.

### Out of scope

- Filtering by subcategory (Phase 9) and the list view (Phase 11).

## Decisions

| #   | Decision                                                                                                                 | Rationale                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| D1  | **Adding the module touches only the module folders, the two registries and the translation files.**                     | Principle 6 (modular): this is the test of the Phase 4 contract.              |
| D2  | **Placeholder names except the Musée du Haut-Richelieu**, named in `mission.md`. Coordinates are approximate and sample. | Same rule as Phase 5 D3.                                                      |
| D3  | **The subcategory is a text badge on the card**; the marker uses one icon for the whole category.                        | Keeps markers simple; per-subcategory icons can come with filters in Phase 9. |
| D4  | **One commit for this phase**, on top of the Phase 5 commit.                                                             | The one-commit-per-phase rule.                                                |
