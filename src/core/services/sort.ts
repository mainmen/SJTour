import { LOCALES, type Language } from '@/core/i18n/language'
import type { BilingualText } from '@/core/types/bilingual'

/**
 * Sorts records by name in the given language, with that language's collation
 * (accents and case don't split groups: "École" sorts with "E"). Returns a new array.
 */
export function sortByName<T extends { readonly name: BilingualText }>(
  records: readonly T[],
  language: Language,
): T[] {
  const collator = new Intl.Collator(LOCALES[language], { sensitivity: 'base', numeric: true })
  return [...records].sort((a, b) => collator.compare(a.name[language], b.name[language]))
}
