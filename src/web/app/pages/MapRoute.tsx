import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

// Leaflet and its CSS load only when the map is shown (specs/2026-11-19-base-map D4).
const MapPage = lazy(() =>
  import('@/web/app/pages/MapPage').then((module) => ({ default: module.MapPage })),
)

/** Shown while the map chunk downloads. */
export function MapLoading() {
  const { t } = useTranslation()
  return (
    <div role="status" className="flex size-full items-center justify-center text-ink-muted">
      {t('map.loading')}
    </div>
  )
}

export function MapRoute() {
  return (
    <Suspense fallback={<MapLoading />}>
      <MapPage />
    </Suspense>
  )
}
