import { useTranslation } from 'react-i18next'
import { MapCanvas } from '@/web/map/MapCanvas'

/** The home page: a full-screen map. Loaded lazily (see MapRoute) so Leaflet stays out of the main bundle. */
export function MapPage() {
  const { t } = useTranslation()
  return (
    <section className="size-full">
      <h2 className="sr-only">{t('pages.map.title')}</h2>
      <MapCanvas />
    </section>
  )
}
