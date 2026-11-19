import 'leaflet/dist/leaflet.css'
import '@/web/map/map.css'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import {
  INITIAL_ZOOM,
  MAP_CENTER,
  MAX_BOUNDS,
  MAX_BOUNDS_VISCOSITY,
  MAX_ZOOM,
  MIN_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from '@/core/map/config'

/**
 * Names the map's focusable container for assistive technology, in the active
 * language. (MapContainer passes no ARIA props through to its DOM node.)
 */
function MapAccessibleName() {
  const map = useMap()
  const { t } = useTranslation()
  const label = t('map.label')
  useEffect(() => {
    const container = map.getContainer()
    container.setAttribute('role', 'region')
    container.setAttribute('aria-label', label)
  }, [map, label])
  return null
}

/**
 * Translated zoom buttons. react-leaflet doesn't update control options after
 * mount, so the control is keyed by language and remounts when it changes;
 * the map itself (and the user's view) stays put.
 */
function TranslatedZoomControl() {
  const { t, i18n } = useTranslation()
  return (
    <ZoomControl
      key={i18n.resolvedLanguage}
      position="bottomright"
      zoomInTitle={t('map.zoomIn')}
      zoomOutTitle={t('map.zoomOut')}
    />
  )
}

/** Full-size OpenStreetMap base map of Saint-Jean-sur-Richelieu. */
export function MapCanvas() {
  return (
    <MapContainer
      className="map-canvas size-full"
      center={[...MAP_CENTER]}
      zoom={INITIAL_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={[[...MAX_BOUNDS[0]], [...MAX_BOUNDS[1]]]}
      maxBoundsViscosity={MAX_BOUNDS_VISCOSITY}
      zoomControl={false}
    >
      <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} maxZoom={MAX_ZOOM} />
      <TranslatedZoomControl />
      <MapAccessibleName />
    </MapContainer>
  )
}
