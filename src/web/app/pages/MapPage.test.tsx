import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { stubDataFetch } from '@/test/data'
import { MemoryRouter } from 'react-router'
import { MapPage } from '@/web/app/pages/MapPage'
import { i18n } from '@/web/i18n'
import { filterStore, selectionStore } from '@/web/state/stores'

// These tests look at markers one by one: a zero radius keeps every marker
// apart. Clustering has its own tests (cluster.test.ts, clusters.test.tsx).
vi.mock('@/core/map/cluster', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/map/cluster')>()
  return {
    ...actual,
    clusterPoints: ((points, zoom) =>
      actual.clusterPoints(points, zoom, 0)) satisfies typeof actual.clusterPoints,
  }
})

// jsdom has no layout: give elements a phone-sized box so Leaflet sets a view.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.restoreAllMocks()
})

const BAKERY = 'Boulangerie exemple, Entreprises'

/** The map page inside a router (the card links to detail pages). */
function renderMap() {
  return render(<MapPage />, { wrapper: MemoryRouter })
}

function marker(name: string) {
  return screen.findByRole('button', { name })
}

describe('MapPage', () => {
  it('shows one labelled marker per company', async () => {
    renderMap()
    const markers = await screen.findAllByRole('button', { name: /, Entreprises$/ })
    expect(markers).toHaveLength(6)
    expect(markers.map((m) => m.getAttribute('aria-label'))).toContain(
      'Parc industriel Iberville, Entreprises',
    )
    for (const m of markers) {
      expect(m).toHaveAttribute('tabindex', '0')
      expect(m).toHaveAttribute('aria-pressed', 'false')
      expect(m.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('shows activity markers next to company markers, and opens an activity card', async () => {
    const user = userEvent.setup()
    renderMap()
    expect(await screen.findAllByRole('button', { name: /, Activités$/ })).toHaveLength(6)
    expect(screen.getAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(6)

    await user.click(await marker('Musée du Haut-Richelieu, Activités'))
    const sheet = screen.getByRole('dialog', { name: 'Musée du Haut-Richelieu' })
    expect(within(sheet).getByText('Activités')).toBeInTheDocument()
    expect(within(sheet).getByText('Culture et musées')).toBeInTheDocument()
  })

  it('shows event markers for upcoming and recent events, not past ones', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-19T12:00:00-05:00'))
    try {
      renderMap()
      const markers = await screen.findAllByRole('button', { name: /, Événements$/ })
      expect(markers.map((m) => m.getAttribute('aria-label'))).toEqual([
        'Marché de Noël exemple, Événements',
        'Concert exemple, Événements',
        "L'International de montgolfières, Événements",
        "Marché d'automne exemple, Événements",
        'Course à pied exemple, Événements',
      ])
    } finally {
      vi.useRealTimers()
    }
  })

  it('draws walking (dashed) and biking (solid) trail layers, a both trail in each', async () => {
    const { container } = renderMap()
    expect(await screen.findAllByRole('button', { name: /, Sentiers$/ })).toHaveLength(3)
    await waitFor(() => expect(container.querySelectorAll('path.trail-line')).toHaveLength(4))
    const walking = container.querySelectorAll('path.trail-line--walking')
    const biking = container.querySelectorAll('path.trail-line--biking')
    expect(walking).toHaveLength(2)
    expect(biking).toHaveLength(2)
    walking.forEach((path) => expect(path).toHaveAttribute('stroke-dasharray'))
    biking.forEach((path) => expect(path).not.toHaveAttribute('stroke-dasharray'))
  })

  it('opens the trail card when a trail line is tapped', async () => {
    const user = userEvent.setup()
    const { container } = renderMap()
    await waitFor(() =>
      expect(container.querySelectorAll('path.trail-line--walking')).toHaveLength(2),
    )
    // Drawn biking first, then walking: the last walking path is the promenade.
    const promenade = [...container.querySelectorAll('path.trail-line--walking')].at(-1)!
    await user.click(promenade)
    const sheet = screen.getByRole('dialog', { name: 'Promenade riveraine exemple' })
    expect(within(sheet).getByText('Sentiers')).toBeInTheDocument()
    expect(within(sheet).getByText('Trottoir de bois')).toBeInTheDocument()
    expect(promenade).toHaveAttribute('stroke-width', '8')
  })

  describe('layer chips', () => {
    function chips() {
      return within(screen.getByRole('group', { name: 'Couches de la carte' })).getAllByRole(
        'button',
      )
    }

    it('shows one pressed chip per layer, in order', () => {
      renderMap()
      expect(chips().map((chip) => chip.textContent)).toEqual([
        'Entreprises',
        'Activités',
        'Événements',
        'Sentiers pédestres',
        'Pistes cyclables',
      ])
      for (const chip of chips()) expect(chip).toHaveAttribute('aria-pressed', 'true')
    })

    it('hides and shows a category when its chip is toggled', async () => {
      const user = userEvent.setup()
      renderMap()
      expect(await screen.findAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(6)
      const companies = screen.getByRole('button', { name: 'Entreprises', pressed: true })
      await user.click(companies)
      expect(companies).toHaveAttribute('aria-pressed', 'false')
      expect(filterStore.getState().enabled).not.toContain('companies')
      expect(screen.queryAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(0)
      expect(screen.getAllByRole('button', { name: /, Activités$/ })).toHaveLength(6)
      await user.click(companies)
      expect(screen.getAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(6)
    })

    it('keeps a both trail on the map while either trail layer is on', async () => {
      const user = userEvent.setup()
      const { container } = renderMap()
      expect(await screen.findAllByRole('button', { name: /, Sentiers$/ })).toHaveLength(3)
      await user.click(screen.getByRole('button', { name: 'Sentiers pédestres' }))
      expect(container.querySelectorAll('path.trail-line--walking')).toHaveLength(0)
      expect(container.querySelectorAll('path.trail-line--biking')).toHaveLength(2)
      const trailMarkers = screen.getAllByRole('button', { name: /, Sentiers$/ })
      expect(trailMarkers.map((m) => m.getAttribute('aria-label'))).toEqual([
        'Piste du canal de Chambly (Route verte), Sentiers',
        "Piste cyclable exemple d'Iberville, Sentiers",
      ])
      await user.click(screen.getByRole('button', { name: 'Pistes cyclables' }))
      expect(container.querySelectorAll('path.trail-line')).toHaveLength(0)
      expect(screen.queryAllByRole('button', { name: /, Sentiers$/ })).toHaveLength(0)
    })

    it('closes the card when its layer is hidden', async () => {
      const user = userEvent.setup()
      renderMap()
      await user.click(await marker(BAKERY))
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Entreprises', pressed: true }))
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(selectionStore.getState().selected).toBeNull()
    })

    it('translates the chips', async () => {
      renderMap()
      await act(() => i18n.changeLanguage('en'))
      expect(screen.getByRole('group', { name: 'Map layers' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Things to do' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Walking paths' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Biking paths' })).toBeInTheDocument()
    })
  })

  it('names markers in the active language', async () => {
    renderMap()
    await marker(BAKERY)
    await act(() => i18n.changeLanguage('en'))
    expect(await marker('Sample Bakery, Companies')).toBeInTheDocument()
  })

  it('opens the card in a bottom sheet when a marker is tapped', async () => {
    const user = userEvent.setup()
    const { container } = renderMap()
    const bakery = await marker(BAKERY)
    await user.click(bakery)

    const sheet = screen.getByRole('dialog', { name: 'Boulangerie exemple' })
    expect(sheet).toHaveFocus()
    expect(bakery).toHaveAttribute('aria-pressed', 'true')
    expect(bakery).toHaveClass('is-selected')
    expect(within(sheet).getByText('Entreprises')).toBeInTheDocument()
    expect(within(sheet).getByText('Entreprise')).toBeInTheDocument()
    expect(within(sheet).getByText('Alimentation')).toBeInTheDocument()
    expect(within(sheet).getByText("Donnée d'exemple")).toBeInTheDocument()
    // The map's bottom controls move above the sheet.
    const section = container.querySelector('section')!
    expect(section.style.getPropertyValue('--sheet-offset')).toBe('8px')
  })

  it('switches the card when another marker is tapped', async () => {
    const user = userEvent.setup()
    renderMap()
    await user.click(await marker(BAKERY))
    // A second click this fast would be a Leaflet double-click (map zoom), which
    // jsdom can't lay out; select the next marker from the keyboard instead.
    ;(await marker('Clinique exemple, Entreprises')).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'Clinique exemple' })).toBeInTheDocument()
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })

  it('opens the card with Enter on a focused marker', async () => {
    const user = userEvent.setup()
    renderMap()
    const bakery = await marker(BAKERY)
    bakery.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'Boulangerie exemple' })).toHaveFocus()
  })

  it('opens the card with Space on a focused marker', async () => {
    const user = userEvent.setup()
    renderMap()
    const bakery = await marker(BAKERY)
    bakery.focus()
    await user.keyboard(' ')
    expect(screen.getByRole('dialog', { name: 'Boulangerie exemple' })).toBeInTheDocument()
  })

  it('closes with Escape and returns focus to the marker', async () => {
    const user = userEvent.setup()
    const { container } = renderMap()
    const bakery = await marker(BAKERY)
    await user.click(bakery)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(bakery).toHaveFocus()
    expect(bakery).toHaveAttribute('aria-pressed', 'false')
    expect(selectionStore.getState().selected).toBeNull()
    expect(container.querySelector('section')!.style.getPropertyValue('--sheet-offset')).toBe('')
  })

  it('closes with the close button and returns focus to the marker', async () => {
    const user = userEvent.setup()
    renderMap()
    const bakery = await marker(BAKERY)
    await user.click(bakery)
    await user.click(screen.getByRole('button', { name: 'Fermer la fiche' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(bakery).toHaveFocus()
  })

  it('zooms to a record selected from a list and opens its card', async () => {
    selectionStore
      .getState()
      .select({ category: 'companies', id: 'atelier-techno-exemple', origin: 'list' })
    const { container } = renderMap()
    expect(
      await screen.findByRole('dialog', { name: 'Atelier techno exemple' }),
    ).toBeInTheDocument()
    // The sheet is open from the first render: the controls still move above it.
    expect(container.querySelector('section')!.style.getPropertyValue('--sheet-offset')).toBe('8px')
    await waitFor(() => {
      const zooms = [...container.querySelectorAll<HTMLImageElement>('img.leaflet-tile')].map(
        (img) => new URL(img.src).pathname.split('/')[1],
      )
      expect(zooms).toContain('16')
    })
  })

  it('shows an alert for a category that fails to load, and Retry recovers', async () => {
    const user = userEvent.setup()
    stubDataFetch({ 'data/companies.json': new TypeError('Failed to fetch') })
    renderMap()
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Impossible de charger : Entreprises.')
    expect(screen.queryAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(0)

    stubDataFetch()
    await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
    expect(await screen.findAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(6)
  })

  it('treats invalid data as a load error too', async () => {
    stubDataFetch({ 'data/companies.json': [{ id: 'broken' }] })
    renderMap()
    expect(await screen.findByRole('alert')).toHaveTextContent('Entreprises')
  })
})
