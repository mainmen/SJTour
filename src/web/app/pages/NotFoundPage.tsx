import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <PlaceholderPage title={t('pages.notFound.title')}>
      <p>{t('pages.notFound.message')}</p>
      <Link
        to="/"
        className="mt-3 inline-block font-medium text-accent underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {t('pages.notFound.backHome')}
      </Link>
    </PlaceholderPage>
  )
}
