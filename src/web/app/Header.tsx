import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/web/app/LanguageToggle'
import { GlassCard } from '@/web/ui/GlassCard'

export function Header() {
  const { t } = useTranslation()
  return (
    <GlassCard
      as="header"
      className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b px-4 pt-[env(safe-area-inset-top)]"
    >
      <h1 className="py-3 text-xl font-bold tracking-tight text-accent">{t('appName')}</h1>
      <LanguageToggle />
    </GlassCard>
  )
}
