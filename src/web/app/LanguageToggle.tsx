import { useTranslation } from 'react-i18next'
import type { Language } from '@/core/i18n/language'
import { chooseLanguage } from '@/web/i18n'
import { RippleButton } from '@/web/ui/RippleButton'

/**
 * Switches between French and English. It shows the *other* language's code and
 * labels itself in that language ("Switch to English" / "Passer au français"),
 * with a matching `lang` so screen readers pronounce it correctly.
 */
export function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const target: Language = i18n.resolvedLanguage === 'en' ? 'fr' : 'en'

  return (
    <RippleButton
      lang={target}
      aria-label={t('language.switchTo', { lng: target })}
      onClick={() => void chooseLanguage(target)}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-sm font-semibold text-accent"
    >
      {t('language.code', { lng: target })}
    </RippleButton>
  )
}
