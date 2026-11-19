import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

// The detail page (and the validation it needs) loads only when it is shown.
const DetailPage = lazy(() =>
  import('@/web/app/pages/DetailPage').then((module) => ({ default: module.DetailPage })),
)

/** Shown while the detail chunk downloads. */
export function DetailLoading() {
  const { t } = useTranslation()
  return (
    <p role="status" className="p-4 text-ink-muted">
      {t('detail.loading')}
    </p>
  )
}

export function DetailRoute() {
  return (
    <Suspense fallback={<DetailLoading />}>
      <DetailPage />
    </Suspense>
  )
}
