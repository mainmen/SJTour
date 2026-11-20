import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/web/app/renderRoute'
import { filterStore, selectionStore } from '@/web/state/stores'

// The shipped events were seeded relative to this day; Leaflet needs a size.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-19T12:00:00-05:00'))
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// At the initial zoom (13) the museum and the bistro, about 300 m apart in
// Old Saint-Jean, would overlap.
const CLUSTER = '2 lieux, Activités. Zoomer pour les afficher'
const MUSEUM = 'Musée du Haut-Richelieu, Activités'
const BISTRO = 'Bistro exemple, Activités'

function status() {
  return screen.getByRole('status')
}

describe('marker clusters', () => {
  it('merge overlapping markers of a category into a labelled badge with a count', async () => {
    renderRoute('/')
    const cluster = await screen.findByRole('button', { name: CLUSTER })
    expect(cluster).toHaveTextContent('2')
    expect(cluster).toHaveAttribute('tabindex', '0')
    expect(cluster).not.toHaveAttribute('aria-pressed')
    expect(cluster.dataset.cluster?.split(' ').sort()).toEqual([
      'activities/bistro-exemple',
      'activities/musee-du-haut-richelieu',
    ])
    expect(screen.queryByRole('button', { name: MUSEUM })).not.toBeInTheDocument()
    // Other activities stay single markers.
    expect(screen.getByRole('button', { name: 'Parc riverain exemple, Activités' })).toBeVisible()
  })

  it('split when tapped (the map zooms in)', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await user.click(await screen.findByRole('button', { name: CLUSTER }))
    expect(await screen.findByRole('button', { name: MUSEUM })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: BISTRO })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: CLUSTER })).not.toBeInTheDocument()
  })

  it('split with Enter and move focus to the first member', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    const cluster = await screen.findByRole('button', { name: CLUSTER })
    cluster.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('button', { name: MUSEUM })).toHaveFocus())
  })

  it('never hide the selected record, even after its card closes', async () => {
    const user = userEvent.setup()
    selectionStore
      .getState()
      .select({ category: 'activities', id: 'bistro-exemple', origin: 'map' })
    renderRoute('/')
    const bistro = await screen.findByRole('button', { name: BISTRO })
    expect(bistro).toHaveAttribute('aria-pressed', 'true')
    // The museum is alone now: no cluster around the selected bistro.
    expect(screen.getByRole('button', { name: MUSEUM })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fermer la fiche' }))
    expect(screen.getByRole('button', { name: BISTRO })).toHaveFocus()
  })
})

describe('map status', () => {
  it('says the places are loading, then says nothing', async () => {
    renderRoute('/')
    await screen.findByText('Chargement des lieux…')
    await waitFor(() => expect(status()).toHaveTextContent(/^$/))
  })

  it('offers Show all when no layer is on', async () => {
    const user = userEvent.setup()
    renderRoute('/?layers=')
    await waitFor(() => expect(status()).toHaveTextContent('Aucune couche sélectionnée.'))
    await user.click(within(status()).getByRole('button', { name: 'Tout afficher' }))
    expect(filterStore.getState().enabled).toHaveLength(5)
    expect(await screen.findByRole('button', { name: CLUSTER })).toBeInTheDocument()
  })

  it('says when the filters leave nothing to show', async () => {
    const user = userEvent.setup()
    // Long after every shipped event: only the events layer, nothing upcoming.
    vi.setSystemTime(new Date('2031-01-01T12:00:00-05:00'))
    renderRoute('/?layers=events')
    await waitFor(() =>
      expect(status()).toHaveTextContent('Aucun lieu à afficher avec ces filtres.'),
    )
    await user.click(within(status()).getByRole('button', { name: 'Tout afficher' }))
    await waitFor(() => expect(status()).toHaveTextContent(/^$/))
  })
})
