import { useTranslation } from 'react-i18next'
import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'

export function AboutPage() {
  const { t } = useTranslation()
  return (
    <PlaceholderPage title={t('pages.about.title')}>{t('pages.about.placeholder')}</PlaceholderPage>
  )
}
