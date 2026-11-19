/** UI languages supported by the app. French is the default (Saint-Jean-sur-Richelieu, Québec). */
export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'fr'

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

/** Primary subtag of a BCP 47 tag, lower-cased: `en-CA` → `en`. */
function primarySubtag(tag: string): string {
  return tag.split(/[-_]/, 1)[0].toLowerCase()
}

/**
 * Picks the language for a visit:
 * 1. a valid saved choice always wins;
 * 2. otherwise the first browser language whose primary subtag is supported;
 * 3. otherwise French.
 */
export function resolveInitialLanguage(
  saved: unknown,
  browserLanguages: readonly string[],
): Language {
  if (isLanguage(saved)) return saved
  for (const tag of browserLanguages) {
    const primary = primarySubtag(tag)
    if (isLanguage(primary)) return primary
  }
  return DEFAULT_LANGUAGE
}

/** BCP 47 locale used for dates and sorting: Canadian French and English. */
export const LOCALES: Record<Language, string> = { fr: 'fr-CA', en: 'en-CA' }
