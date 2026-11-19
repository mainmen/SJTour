import { ArrowLeftIcon, MapPinIcon, NavigationIcon, Share2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { directionsUrl } from '@/core/services/directions'
import { selectCollection } from '@/core/store/catalog'
import { pickText } from '@/core/types/bilingual'
import { setDocumentTitle } from '@/web/adapters/documentTitle'
import { browserMapsProvider, shareLink, type ShareOutcome } from '@/web/adapters/share'
import { NotFoundPage } from '@/web/app/pages/NotFoundPage'
import { findWebModule } from '@/web/modules/registry'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, useAppStore } from '@/web/state/stores'
import { useLanguage } from '@/web/state/useLanguage'
import { useShowOnMap } from '@/web/state/useShowOnMap'
import { RippleButton } from '@/web/ui/RippleButton'

const actionClass =
  'flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
const primaryAction = `${actionClass} bg-accent text-white`
const secondaryAction = `${actionClass} border border-accent text-accent`

/** Goes back in the app's history, or to the map when the page was opened from a link. */
function BackButton() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <RippleButton
      onClick={() => void (location.key === 'default' ? navigate('/') : navigate(-1))}
      className="-ml-2 flex min-h-11 items-center gap-1 self-start rounded-lg px-2 font-medium text-accent"
    >
      <ArrowLeftIcon aria-hidden="true" className="size-5" />
      {t('detail.back')}
    </RippleButton>
  )
}

function DetailBody({ module, id }: { module: WebCategoryModule; id: string }) {
  const { t } = useTranslation()
  const language = useLanguage()
  const showOnMap = useShowOnMap()
  const collection = useAppStore(catalogStore, (state) => selectCollection(state, module.core))
  const [shareOutcome, setShareOutcome] = useState<ShareOutcome | null>(null)

  useEffect(() => {
    void catalogStore.getState().load(module.core)
  }, [module])

  const record =
    collection.status === 'success' ? collection.records.find((r) => r.id === id) : null
  const name = record ? pickText(record.name, language) : null

  // The page title names the record, for tabs, history and shared links.
  useEffect(() => {
    if (!name) return
    return setDocumentTitle(t('detail.documentTitle', { name, appName: t('appName') }))
  }, [name, t])

  if (collection.status === 'error') {
    return (
      <div role="alert" className="flex items-center gap-3 text-sm text-ink">
        <p className="flex-1">{t('detail.loadError')}</p>
        <RippleButton
          onClick={() => void catalogStore.getState().load(module.core, { reload: true })}
          className="min-h-11 rounded-lg px-3 font-semibold text-accent"
        >
          {t('map.retry')}
        </RippleButton>
      </div>
    )
  }
  if (collection.status !== 'success') {
    return (
      <p role="status" className="text-ink-muted">
        {t('detail.loading')}
      </p>
    )
  }
  if (!record || !name) {
    return (
      <>
        <h2 className="text-lg font-semibold text-ink">{t('detail.notFound.title')}</h2>
        <p className="text-ink-muted">{t('detail.notFound.message')}</p>
        <Link
          to="/"
          className="font-medium text-accent underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {t('pages.notFound.backHome')}
        </Link>
      </>
    )
  }

  const { Card, Icon } = module
  const share = async () => {
    setShareOutcome(null)
    setShareOutcome(await shareLink({ title: name, url: window.location.href }))
  }

  return (
    <article aria-labelledby="detail-title" className="flex flex-col gap-4">
      <header>
        <p className="flex items-center gap-1.5 text-sm font-medium text-ink-muted">
          <Icon aria-hidden="true" className="size-4" />
          {t(module.labelKey)}
        </p>
        <h2 id="detail-title" className="mt-0.5 text-2xl leading-tight font-bold text-ink">
          {name}
        </h2>
      </header>
      <div className="flex flex-wrap gap-2">
        <a
          href={directionsUrl(record.coordinates, browserMapsProvider())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('detail.directions')} ${t('detail.directionsHint')}`}
          className={primaryAction}
        >
          <NavigationIcon aria-hidden="true" className="size-4" />
          {t('detail.directions')}
        </a>
        <RippleButton onClick={() => showOnMap(module, record)} className={secondaryAction}>
          <MapPinIcon aria-hidden="true" className="size-4" />
          {t('events.showOnMap')}
        </RippleButton>
        <RippleButton onClick={() => void share()} className={secondaryAction}>
          <Share2Icon aria-hidden="true" className="size-4" />
          {t('detail.share')}
        </RippleButton>
      </div>
      <p role="status" className="text-sm text-ink-muted empty:hidden">
        {shareOutcome === 'copied' && t('detail.copied')}
        {shareOutcome === 'failed' && t('detail.shareFailed', { url: window.location.href })}
      </p>
      <Card record={record} />
    </article>
  )
}

/**
 * Full details of one record at `/:category/:id`, deep-linkable and shareable,
 * with a "Directions" hand-off to the device's maps app. Loaded lazily.
 */
export function DetailPage() {
  const { category = '', id = '' } = useParams()
  const module = findWebModule(category)
  if (!module) return <NotFoundPage />
  return (
    <section className="mx-auto flex max-w-md flex-col gap-3 p-4">
      <BackButton />
      <DetailBody key={`${category}/${id}`} module={module} id={id} />
    </section>
  )
}
