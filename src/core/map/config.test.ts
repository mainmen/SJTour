import {
  INITIAL_ZOOM,
  isInBounds,
  MAP_CENTER,
  MAX_BOUNDS,
  MAX_BOUNDS_VISCOSITY,
  MAX_ZOOM,
  MIN_ZOOM,
  OSM_ATTRIBUTION,
  OSM_COPYRIGHT_URL,
  OSM_TILE_URL,
} from '@/core/map/config'

describe('map config', () => {
  it('centers on Saint-Jean-sur-Richelieu', () => {
    expect(MAP_CENTER).toEqual([45.3073, -73.2625])
  })

  it('has an increasing zoom range within OSM tile limits', () => {
    expect(MIN_ZOOM).toBe(11)
    expect(INITIAL_ZOOM).toBe(13)
    expect(MAX_ZOOM).toBe(18)
    expect(MIN_ZOOM).toBeLessThan(INITIAL_ZOOM)
    expect(INITIAL_ZOOM).toBeLessThan(MAX_ZOOM)
    expect(MAX_ZOOM).toBeLessThanOrEqual(19)
  })

  it('has well-formed bounds that contain the center', () => {
    const [[south, west], [north, east]] = MAX_BOUNDS
    expect(south).toBeLessThan(north)
    expect(west).toBeLessThan(east)
    expect(isInBounds(MAP_CENTER, MAX_BOUNDS)).toBe(true)
  })

  it('keeps the bounds near the city', () => {
    expect(isInBounds([45.5017, -73.5673], MAX_BOUNDS)).toBe(false) // Montréal
    expect(isInBounds([45.4, -73.25], MAX_BOUNDS)).toBe(true) // north of Saint-Luc
  })

  it('has a viscosity between 0 and 1', () => {
    expect(MAX_BOUNDS_VISCOSITY).toBeGreaterThan(0)
    expect(MAX_BOUNDS_VISCOSITY).toBeLessThanOrEqual(1)
  })

  it('uses OSM standard tiles over HTTPS', () => {
    expect(OSM_TILE_URL).toBe('https://tile.openstreetmap.org/{z}/{x}/{y}.png')
  })

  it('carries the required OSM attribution with the copyright link', () => {
    const text = OSM_ATTRIBUTION.replace(/<[^>]+>/g, '')
    expect(text).toBe('© OpenStreetMap contributors')
    expect(OSM_ATTRIBUTION).toContain(`href="${OSM_COPYRIGHT_URL}"`)
    expect(OSM_COPYRIGHT_URL).toBe('https://www.openstreetmap.org/copyright')
  })
})
