import { useTranslation } from 'react-i18next'
import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'

export function ListPage() {
  const { t } = useTranslation()
  return (
    <PlaceholderPage title={t('pages.list.title')}>{t('pages.list.placeholder')}</PlaceholderPage>
  )
}
