import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  resolveInitialLanguage,
  SUPPORTED_LANGUAGES,
  type Language,
} from '@/core/i18n/language'
import { loadLanguage, saveLanguage } from '@/web/adapters/languageStorage'
import { languageStore } from '@/web/state/stores'
import en from '@/web/i18n/en.json'
import fr from '@/web/i18n/fr.json'

/**
 * Switches the UI language as an explicit user choice and remembers it.
 * (A language detected from the browser is not saved, so it can still follow
 * the browser setting on later visits.)
 */
export async function chooseLanguage(language: Language): Promise<void> {
  saveLanguage(language)
  await i18n.changeLanguage(language)
}

// Keep <html lang> in sync for screen-reader pronunciation (WCAG 3.1.1), and the
// core language store in sync for core logic (sorting, search).
// Registered before init so it also runs for the initial language.
i18n.on('languageChanged', (lng) => {
  if (!isLanguage(lng)) return
  document.documentElement.lang = lng
  languageStore.getState().setLanguage(lng)
})

// Resources are bundled, so init is synchronous: no loading state, no flash of keys.
void i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  lng: resolveInitialLanguage(loadLanguage(), navigator.languages ?? []),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: { escapeValue: false }, // React already escapes.
})

export { i18n }
