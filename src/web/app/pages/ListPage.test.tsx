import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { stubDataFetch } from '@/test/data'
import { renderRoute } from '@/web/app/renderRoute'
import { i18n } from '@/web/i18n'
import { filterStore, selectionStore } from '@/web/state/stores'

// The shipped events were seeded relative to this day; Leaflet needs a size
// when "Show on map" opens the map.
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

/** Category headings, once the page has loaded everything. */
async function findHeadings() {
  await screen.findByText(/éléments? affichés?$/)
  return screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
}

/** Names of the items listed under a category heading. */
function itemsOf(heading: string | RegExp) {
  const section = screen.getByRole('region', { name: heading })
  return within(section)
    .queryAllByRole('listitem')
    .map((item) => within(item).getByRole('heading', { level: 4 }).textContent)
}

describe('ListPage', () => {
  it('lists every visible item, grouped by category with counts', async () => {
    renderRoute('/list')
    expect(await findHeadings()).toEqual([
      'Entreprises (6)',
      'Activités (6)',
      'Événements (5)',
      'Sentiers (3)',
    ])
    expect(screen.getByRole('status')).toHaveTextContent('20 éléments affichés')
  })

  it('sorts items by name in the active language', async () => {
    renderRoute('/list')
    await findHeadings()
    const companies = itemsOf(/^Entreprises/)
    expect(companies).toEqual([...companies].sort((a, b) => a!.localeCompare(b!, 'fr-CA')))
    expect(itemsOf(/^Sentiers/)).toEqual([
      "Piste cyclable exemple d'Iberville",
      'Piste du canal de Chambly (Route verte)',
      'Promenade riveraine exemple',
    ])
  })

  it('shows a summary line for each category', async () => {
    renderRoute('/list')
    await findHeadings()
    const item = (name: string) => screen.getByRole('link', { name }).closest('li') as HTMLElement
    expect(
      within(item('Piste du canal de Chambly (Route verte)')).getByText(
        '15,1 km · Facile · Marche et vélo',
      ),
    ).toBeInTheDocument()
    expect(
      within(item('Boulangerie exemple')).getByText('Entreprise · Alimentation'),
    ).toBeInTheDocument()
    expect(
      within(item('Musée du Haut-Richelieu')).getByText('Culture et musées'),
    ).toBeInTheDocument()
    expect(within(item('Concert exemple')).getByText(/sam\. 5 décembre 2026/)).toBeInTheDocument()
  })

  it('leaves out past events', async () => {
    renderRoute('/list')
    await findHeadings()
    expect(itemsOf(/^Événements/)).not.toContain('Fête de la rentrée exemple')
  })

  it('follows the layer chips and mirrors them to the URL', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/list')
    await findHeadings()
    await user.click(screen.getByRole('button', { name: 'Entreprises', pressed: true }))
    expect(screen.queryByRole('region', { name: /^Entreprises/ })).toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent('14 éléments affichés')
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get('layers')).toBe(
        'activities,events,walking,biking',
      ),
    )
  })

  it('applies a shared link: a both trail is listed once under biking', async () => {
    renderRoute('/list?layers=biking')
    expect(await findHeadings()).toEqual(['Sentiers (2)'])
    expect(itemsOf(/^Sentiers/)).toEqual([
      "Piste cyclable exemple d'Iberville",
      'Piste du canal de Chambly (Route verte)',
    ])
  })

  it('offers to show everything when no layer is on', async () => {
    const user = userEvent.setup()
    renderRoute('/list?layers=')
    expect(await screen.findByText('Aucune couche sélectionnée.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tout afficher' }))
    expect(await findHeadings()).toHaveLength(4)
  })

  it('links each item to its detail page', async () => {
    renderRoute('/list')
    await findHeadings()
    expect(screen.getByRole('link', { name: 'Musée du Haut-Richelieu' })).toHaveAttribute(
      'href',
      '/activities/musee-du-haut-richelieu',
    )
  })

  it('"Show on map" focuses the item on the map', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/list')
    await findHeadings()
    await user.click(
      screen.getByRole('button', { name: 'Voir sur la carte : Promenade riveraine exemple' }),
    )
    expect(router.state.location.pathname).toBe('/')
    expect(selectionStore.getState().selected).toEqual({
      category: 'trails',
      id: 'promenade-riveraine-exemple',
      origin: 'list',
    })
    expect(await screen.findByRole('dialog', { name: 'Promenade riveraine exemple' })).toHaveFocus()
  })

  it('highlights the item selected on the map when coming back', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await user.click(await screen.findByRole('button', { name: 'Clinique exemple, Entreprises' }))
    await user.click(screen.getByRole('link', { name: 'Liste' }))
    await findHeadings()
    const item = screen
      .getAllByRole('listitem')
      .find((li) => li.getAttribute('aria-current') === 'true')
    expect(item).toBeDefined()
    expect(within(item!).getByRole('heading', { level: 4 })).toHaveTextContent('Clinique exemple')
    expect(within(item!).getByText('Sélectionné sur la carte')).toBeInTheDocument()
    expect(
      screen.getAllByRole('listitem').filter((li) => li.hasAttribute('aria-current')),
    ).toHaveLength(1)
  })

  it('shows an alert for a category that fails to load, and Retry recovers', async () => {
    stubDataFetch({ 'data/trails.geojson': new TypeError('Failed to fetch') })
    const user = userEvent.setup()
    renderRoute('/list')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Impossible de charger : Sentiers.')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)
    stubDataFetch()
    await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))
    expect(
      await screen.findByRole('heading', { level: 3, name: 'Sentiers (3)' }),
    ).toBeInTheDocument()
  })

  it('switches to English', async () => {
    renderRoute('/list')
    await findHeadings()
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByRole('heading', { level: 2, name: 'List' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Things to do (6)' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('20 items shown')
    expect(filterStore.getState().enabled).toHaveLength(5)
  })
})
