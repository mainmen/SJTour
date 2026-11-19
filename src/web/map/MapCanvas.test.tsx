import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MAX_ZOOM, MIN_ZOOM, OSM_COPYRIGHT_URL } from '@/core/map/config'
import { i18n } from '@/web/i18n'
import { MapCanvas } from '@/web/map/MapCanvas'

// jsdom has no layout, so every element measures 0 × 0 and Leaflet would load
// no tiles. Give elements a phone-sized box for these tests.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function mapRegion() {
  return screen.getByRole('region', { name: i18n.t('map.label') })
}

describe('MapCanvas', () => {
  it('renders a focusable map region with a translated name', () => {
    render(<MapCanvas />)
    const region = mapRegion()
    expect(region).toHaveClass('leaflet-container', 'map-canvas')
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveAccessibleName('Carte interactive de Saint-Jean-sur-Richelieu')
  })

  it('loads OpenStreetMap tiles around the city center at zoom 13', () => {
    const { container } = render(<MapCanvas />)
    const tiles = [...container.querySelectorAll<HTMLImageElement>('img.leaflet-tile')]
    expect(tiles.length).toBeGreaterThan(0)
    for (const tile of tiles) {
      expect(tile.src).toMatch(/^https:\/\/tile\.openstreetmap\.org\/13\/\d+\/\d+\.png$/)
    }
    // Zoom 13 tile containing [45.3073, -73.2625]: x = 2428, y = 2936.
    expect(tiles.map((t) => t.src)).toContain('https://tile.openstreetmap.org/13/2428/2936.png')
  })

  it('always shows the OpenStreetMap attribution with its copyright link', () => {
    const { container } = render(<MapCanvas />)
    const attribution = container.querySelector<HTMLElement>('.leaflet-control-attribution')
    expect(attribution).not.toBeNull()
    expect(attribution).toHaveTextContent('© OpenStreetMap contributors')
    expect(within(attribution!).getByRole('link', { name: 'OpenStreetMap' })).toHaveAttribute(
      'href',
      OSM_COPYRIGHT_URL,
    )
  })

  it('has French zoom buttons that switch to English with the language', async () => {
    render(<MapCanvas />)
    const region = mapRegion()
    expect(within(region).getByRole('button', { name: 'Zoom avant' })).toBeInTheDocument()
    expect(within(region).getByRole('button', { name: 'Zoom arrière' })).toBeInTheDocument()

    await act(() => i18n.changeLanguage('en'))

    expect(region).toBe(mapRegion()) // same map: the view is not reset
    expect(region).toHaveAccessibleName('Interactive map of Saint-Jean-sur-Richelieu')
    expect(within(region).getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    expect(within(region).getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
    expect(within(region).queryByRole('button', { name: 'Zoom avant' })).toBeNull()
  })

  it('stops zooming out at 11 and in at 18', async () => {
    const user = userEvent.setup()
    const { container } = render(<MapCanvas />)
    const zoomOut = screen.getByRole('button', { name: 'Zoom arrière' })
    const zoomIn = screen.getByRole('button', { name: 'Zoom avant' })
    const tileZooms = () =>
      new Set(
        [...container.querySelectorAll<HTMLImageElement>('img.leaflet-tile')].map(
          (img) => new URL(img.src).pathname.split('/')[1],
        ),
      )

    for (let i = 0; i < 4; i++) await user.click(zoomOut)
    expect(tileZooms()).toEqual(new Set([String(MIN_ZOOM)]))
    expect(zoomOut).toHaveClass('leaflet-disabled')
    expect(zoomOut).toHaveAttribute('aria-disabled', 'true')

    for (let i = 0; i < 10; i++) await user.click(zoomIn)
    expect(tileZooms()).toEqual(new Set([String(MAX_ZOOM)]))
    expect(zoomIn).toHaveClass('leaflet-disabled')
  })

  it('places the zoom control at the bottom right, above the nav', () => {
    const { container } = render(<MapCanvas />)
    const zoom = container.querySelector('.leaflet-control-zoom')
    expect(zoom?.closest('.leaflet-bottom.leaflet-right')).not.toBeNull()
  })
})
