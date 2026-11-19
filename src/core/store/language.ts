import { createStore } from 'zustand/vanilla'
import { DEFAULT_LANGUAGE, type Language } from '@/core/i18n/language'

export type LanguageState = {
  readonly language: Language
  setLanguage(language: Language): void
}

/**
 * The active content language, for core logic that picks `fr`/`en` text
 * (sorting, search). The web layer keeps it in sync with i18next.
 */
export function createLanguageStore(initial: Language = DEFAULT_LANGUAGE) {
  return createStore<LanguageState>()((set) => ({
    language: initial,
    setLanguage: (language) => set({ language }),
  }))
}

export type LanguageStore = ReturnType<typeof createLanguageStore>
