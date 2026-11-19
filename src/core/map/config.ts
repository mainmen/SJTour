/**
 * Base map settings (specs/tech-stack.md → Map defaults). Plain data with no
 * Leaflet types, so any map renderer (web today, native later) can use them.
 */

/** `[latitude, longitude]` in decimal degrees. */
export type LatLng = readonly [lat: number, lng: number]

/** `[southWest, northEast]` corners. */
export type LatLngBounds = readonly [southWest: LatLng, northEast: LatLng]

/** Saint-Jean-sur-Richelieu (old Saint-Jean, on the Richelieu River). */
export const MAP_CENTER: LatLng = [45.3073, -73.2625]

export const INITIAL_ZOOM = 13
/** Shows the whole municipality on a phone. */
export const MIN_ZOOM = 11
/** OSM standard tiles go to 19; 18 is detailed enough for street level. */
export const MAX_ZOOM = 18

/**
 * Panning limit: the municipality (Saint-Jean, Iberville, Saint-Luc, L'Acadie,
 * Saint-Athanase) plus a margin, so users can't lose the city.
 */
export const MAX_BOUNDS: LatLngBounds = [
  [45.15, -73.5],
  [45.47, -73.05],
]

/** How firmly the map resists being dragged out of `MAX_BOUNDS` (0–1). */
export const MAX_BOUNDS_VISCOSITY = 0.8

/** OpenStreetMap standard raster tiles (no API key; follow the OSM tile usage policy). */
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

export const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright'

/**
 * Required attribution, kept as OSM's English legal notice and not translated
 * (specs/2026-11-19-base-map D5). HTML, as map renderers expect.
 */
export const OSM_ATTRIBUTION = `© <a href="${OSM_COPYRIGHT_URL}">OpenStreetMap</a> contributors`

export function isInBounds([lat, lng]: LatLng, [[south, west], [north, east]]: LatLngBounds) {
  return lat >= south && lat <= north && lng >= west && lng <= east
}
