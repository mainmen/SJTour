import { useTranslation } from 'react-i18next'
import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'

export function MapPage() {
  const { t } = useTranslation()
  return (
    <PlaceholderPage title={t('pages.map.title')}>{t('pages.map.placeholder')}</PlaceholderPage>
  )
}
