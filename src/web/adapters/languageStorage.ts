import { isLanguage, type Language } from '@/core/i18n/language'

export const LANGUAGE_STORAGE_KEY = 'stjeantour.language'

/**
 * Reads the saved language choice. Returns `null` when nothing valid is saved
 * or storage is unavailable (private mode, blocked site data, …).
 */
export function loadLanguage(): Language | null {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguage(value) ? value : null
  } catch {
    return null
  }
}

/** Saves the language choice. Storage failures are ignored: the choice then lasts for this visit only. */
export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Storage unavailable: nothing to do.
  }
}
