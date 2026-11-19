# Phase 12: Search — Requirements

- **Branch:** `feature/search`, from `main` after the Phase 8–11 merge (PR #7). Phase 12 goes out in its own PR.
- **Roadmap reference:** `specs/roadmap.md` → Milestone 1, Phase 12
- **Guidance:** `specs/mission.md` (bilingual content; map-centric, list-friendly), `specs/tech-stack.md` (filter state mirrored to URL query params; bundle budget)

## Context

Four categories and two trail layers already filter the map and the list. With about 40 places (and more after Phase 13), people also need to find one by name or by what it is ("kayak", "musée", "balloon"). The data is small and static, so search runs on the client, with no index library.

## Scope

### In scope

1. **Core text search** `src/core/search/text.ts`:
   - `normalizeSearchText`: case-, accent- and ligature-insensitive (`É` → `e`, `œ` → `oe`); punctuation and apostrophes become spaces (`Saint-Jean` ≡ `saint jean`, `d'Iberville` ≡ `d iberville`).
   - `searchTokens(query)`: the normalized words of a query.
   - `matchesSearch(record, query)`: every word of the query starts a word of the record's **name or description, in French or in English** (whatever the UI language). An empty query matches everything. The normalized text of each record is cached (`WeakMap`).
2. **Filter store:** `query` (raw text, `''` by default), `setQuery`, `clearQuery`; no state change when nothing changes. `showAll` keeps the query (it is about layers).
3. **Selectors:** `visibleRecords(module, records, enabled, now, query?)` applies the search after the layers; `isRecordShown(module, record, enabled, query)` for the map's card.
4. **URL format** `src/core/filters/url.ts`: `?q=<text>`; absent = no opinion; blank = no search (parameter removed). Capped at `MAX_QUERY_LENGTH` (100) characters.
5. **URL sync:** `useFilterUrlSync` mirrors `q` like `layers` (a shared link wins; otherwise the current query is written in with `replace`). Its own writes are not read back, so fast typing is never overwritten by a late URL update.
6. **Web `SearchBox`** (`src/web/filters/SearchBox.tsx`), bound to the store: a `role="search"` landmark with a labelled `type="search"` input (search icon, placeholder), a **Clear** button while there is text (focus returns to the input), Escape clears, Enter only closes the on-screen keyboard (no page reload).
7. **Map:** the search box sits above the chips. Markers and trail lines follow the search. While searching, a polite status gives the number of results and a **See in the list** link; searching away the selected record closes its card (as with layers).
8. **List:** the search box sits above the chips; sections and counts follow the search; while searching, categories with no match are left out, and no match at all shows "No results for “…”" with a **Clear search** button.
9. **Show on map** (list, events, detail): if the record doesn't match the current search, the search is cleared so the record is shown.
10. **i18n:** label, placeholder, clear, result count (plural), no results, see in the list.

### Out of scope

- Fuzzy / typo-tolerant matching, ranking by relevance, highlighting matches, suggestions (later, if real data shows a need).
- Searching other fields (address, sector names, trail surface…): names and descriptions only, as the roadmap says.
- Searching the events page (it keeps its Upcoming / Recent tabs).
- Fitting the map to the results (the list and its "Show on map" cover finding one place).

## Decisions

| #   | Decision                                                                                                       | Rationale                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| D1  | **Both languages are always searched**, whatever the UI language.                                              | Names are often French in English mode ("Musée du Haut-Richelieu"); visitors type what they see or know. |
| D2  | **Word-prefix matching, every word required** (AND), after normalizing case, accents and punctuation.          | Typing narrows results predictably; "mont" finds "montgolfières" but "art" doesn't match "départ".       |
| D3  | **No search library, no index**: a cached normalized string per record, scanned on each keystroke.             | ~40 records today, a few hundred later; nothing added to the bundle budget.                              |
| D4  | **The query lives in the filter store and the URL** (`?q=`), shared by the map and the list.                   | Same model as layers: a search is shareable and survives switching between map and list.                 |
| D5  | **Search filters; the list stays sorted by name.**                                                             | Predictable order for screen-reader users (Phase 11 D1); ranking is out of scope.                        |
| D6  | **Show on map always shows the record**: it re-enables its layers (Phase 11) and clears a non-matching search. | The user asked for that place; a card that closes immediately would look broken.                         |
| D7  | **One commit for this phase**, one PR.                                                                         | The one-commit-per-phase rule.                                                                           |
