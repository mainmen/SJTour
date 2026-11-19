import type { Language } from '@/core/i18n/language'
import { languageStore, useAppStore } from '@/web/state/stores'

/** The active content language (kept in sync with i18next). */
export function useLanguage(): Language {
  return useAppStore(languageStore, (state) => state.language)
}
