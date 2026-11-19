import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterUrlSync } from '@/web/filters/useFilterUrlSync'

// The list page (and the validation it needs) loads only when it is shown.
const ListPage = lazy(() =>
  import('@/web/app/pages/ListPage').then((module) => ({ default: module.ListPage })),
)

/** Shown while the list chunk downloads. */
export function ListLoading() {
  const { t } = useTranslation()
  return (
    <p role="status" className="p-4 text-ink-muted">
      {t('list.loading')}
    </p>
  )
}

export function ListRoute() {
  // Same filters as the map, mirrored to the URL (specs/2026-11-19-filtering D3).
  useFilterUrlSync()
  return (
    <Suspense fallback={<ListLoading />}>
      <ListPage />
    </Suspense>
  )
}
