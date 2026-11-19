import { LOCALES, type Language } from '@/core/i18n/language'

/** A distance in km, per locale, with one decimal at most: "15,1 km" / "15.1 km". */
export function formatKm(km: number, language: Language): string {
  return new Intl.NumberFormat(LOCALES[language], {
    style: 'unit',
    unit: 'kilometer',
    maximumFractionDigits: 1,
  }).format(km)
}
