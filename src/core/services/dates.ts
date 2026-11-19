import { LOCALES, type Language } from '@/core/i18n/language'

/**
 * Formats a calendar date (`YYYY-MM-DD`, e.g. `lastVerified`) for display:
 * "19 novembre 2026" / "November 19, 2026". Read as UTC midnight and formatted
 * in UTC, so the day never shifts with the device's time zone.
 */
export function formatDate(isoDate: string, language: Language): string {
  return new Intl.DateTimeFormat(LOCALES[language], {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}
