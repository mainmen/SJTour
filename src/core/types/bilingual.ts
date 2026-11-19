import type { Language } from '@/core/i18n/language'

/** User-facing text in both app languages (specs/mission.md → Language). */
export type BilingualText = { readonly fr: string; readonly en: string }

/** The text in the given language. */
export function pickText(text: BilingualText, language: Language): string {
  return text[language]
}
