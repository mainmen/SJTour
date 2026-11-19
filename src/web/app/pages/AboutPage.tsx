import { useTranslation } from 'react-i18next'
import { OSM_COPYRIGHT_URL } from '@/core/map/config'

/** What the app is, where its data comes from, map credits and privacy. */
export function AboutPage() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-4 p-4 text-ink">
      <h2 className="text-lg font-semibold">{t('pages.about.title')}</h2>
      <p>{t('pages.about.intro')}</p>

      <h3 className="text-base font-semibold">{t('pages.about.dataTitle')}</h3>
      <p>{t('pages.about.data')}</p>

      <h3 className="text-base font-semibold">{t('pages.about.mapTitle')}</h3>
      <p>
        {t('pages.about.mapCredit')}{' '}
        <a
          href={OSM_COPYRIGHT_URL}
          className="font-semibold text-accent underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {t('pages.about.mapLink')}
        </a>
      </p>

      <h3 className="text-base font-semibold">{t('pages.about.privacyTitle')}</h3>
      <p>{t('pages.about.privacy')}</p>
    </section>
  )
}
