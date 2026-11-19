import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '@/web/map/BottomSheet'
import { CategoryMarkers } from '@/web/map/CategoryMarkers'
import { LoadErrors } from '@/web/map/LoadErrors'
import { MapCanvas } from '@/web/map/MapCanvas'
import { RevealSelection } from '@/web/map/RevealSelection'
import { webModules } from '@/web/modules/registry'
import { catalogStore } from '@/web/state/stores'

/**
 * The home page: a full-screen map with every category's markers and the
 * selected record's card. Loaded lazily (see MapRoute) so Leaflet stays out of
 * the main bundle.
 */
export function MapPage() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    for (const module of webModules) void catalogStore.getState().load(module.core)
  }, [])

  return (
    <section ref={sectionRef} className="relative size-full">
      <h2 className="sr-only">{t('pages.map.title')}</h2>
      <MapCanvas>
        {webModules.map((module) => (
          <CategoryMarkers key={module.id} module={module} />
        ))}
        <RevealSelection />
      </MapCanvas>
      <LoadErrors modules={webModules} />
      <BottomSheet offsetTarget={sectionRef} />
    </section>
  )
}
