import type { BilingualText } from '@/core/types/bilingual'

/** What search looks at: a record's name and description (specs/2026-11-19-search). */
export type Searchable = {
  readonly name: BilingualText
  readonly description: BilingualText
}

/**
 * Text folded for matching: lower case, no accents, ligatures spelled out
 * (`œ` → `oe`), and any run of non-letters/digits (spaces, hyphens,
 * apostrophes, punctuation) turned into one space. `Saint-Jean` → `saint jean`.
 */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** The normalized words of a query (none for a blank query). */
export function searchTokens(query: string): string[] {
  const normalized = normalizeSearchText(query)
  return normalized === '' ? [] : normalized.split(' ')
}

// Records are immutable once loaded, so their folded text is computed once.
const haystacks = new WeakMap<Searchable, string>()

/** The record's name and description in both languages, folded, each word preceded by a space. */
function haystackOf(record: Searchable): string {
  let haystack = haystacks.get(record)
  if (haystack === undefined) {
    const { name, description } = record
    haystack = ` ${normalizeSearchText(
      [name.fr, name.en, description.fr, description.en].join(' '),
    )}`
    haystacks.set(record, haystack)
  }
  return haystack
}

/**
 * Whether every word of the query starts a word of the record's name or
 * description, in French or English (D1, D2). A blank query matches everything.
 */
export function matchesSearch(record: Searchable, query: string): boolean {
  return matchesTokens(record, searchTokens(query))
}

function matchesTokens(record: Searchable, tokens: readonly string[]): boolean {
  if (tokens.length === 0) return true
  const haystack = haystackOf(record)
  return tokens.every((token) => haystack.includes(` ${token}`))
}

/** The records matching the query, in their original order. */
export function searchRecords<T extends Searchable>(records: readonly T[], query: string): T[] {
  const tokens = searchTokens(query)
  return records.filter((record) => matchesTokens(record, tokens))
}
