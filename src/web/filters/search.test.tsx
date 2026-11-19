import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/web/app/renderRoute'
import { i18n } from '@/web/i18n'
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

type Router = ReturnType<typeof renderRoute>['router']

const MUSEUM = 'Musée du Haut-Richelieu, Activités'

function searchParam(router: Router) {
  return new URLSearchParams(router.state.location.search).get('q')
}

function searchBox() {
  return within(screen.getByRole('search', { name: 'Recherche' })).getByRole('searchbox', {
    name: 'Rechercher un lieu, une activité ou un événement',
  })
}

/** Every map marker's accessible name. */
function markerNames() {
  return screen
    .queryAllByRole('button', { name: /, (Entreprises|Activités|Événements|Sentiers)$/ })
    .map((marker) => marker.getAttribute('aria-label'))
}

async function openMap(path = '/', ready = MUSEUM) {
  const view = renderRoute(path)
  await screen.findByRole('button', { name: ready })
  return view
}

/** Category headings of the list, once everything has loaded. */
async function listHeadings() {
  await waitFor(() => expect(screen.getByRole('status')).not.toHaveTextContent(/Chargement/))
  return screen.queryAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
}

describe('search on the map', () => {
  it('hides markers that do not match, ignoring accents and the UI language', async () => {
    const user = userEvent.setup()
    await openMap()
    expect(markerNames().length).toBeGreaterThan(10)

    await user.type(searchBox(), 'musee')
    expect(markerNames()).toEqual([MUSEUM])

    // English words find the museum while the app is in French.
    await user.clear(searchBox())
    await user.type(searchBox(), 'MUSEUM regional')
    expect(markerNames()).toEqual([MUSEUM])
  })

  it('counts the results in a polite status that links to the list', async () => {
    const user = userEvent.setup()
    const { router } = await openMap()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('')

    await user.type(searchBox(), 'parc')
    expect(status).toHaveTextContent('3 résultats')
    expect(markerNames()).toEqual([
      'Parc industriel Iberville, Entreprises',
      'Parc riverain exemple, Activités',
      'Parc de quartier exemple, Activités',
    ])

    await user.type(searchBox(), 'zzz')
    expect(status).toHaveTextContent('Aucun résultat pour « parczzz ».')
    expect(markerNames()).toEqual([])

    await user.click(within(status).getByRole('link', { name: 'Voir dans la liste' }))
    expect(router.state.location.pathname).toBe('/list')
  })

  it('combines with the layer chips', async () => {
    const user = userEvent.setup()
    await openMap()
    await user.type(searchBox(), 'parc')
    await user.click(screen.getByRole('button', { name: 'Activités', pressed: true }))
    expect(markerNames()).toEqual(['Parc industriel Iberville, Entreprises'])
    expect(screen.getByRole('status')).toHaveTextContent('1 résultat')
  })

  it('clears with the button or Escape, keeping focus in the box', async () => {
    const user = userEvent.setup()
    await openMap()
    const total = markerNames().length

    await user.type(searchBox(), 'kayak')
    expect(markerNames()).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))
    expect(searchBox()).toHaveValue('')
    expect(searchBox()).toHaveFocus()
    expect(markerNames()).toHaveLength(total)
    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).not.toBeInTheDocument()

    await user.type(searchBox(), 'kayak{Escape}')
    expect(searchBox()).toHaveValue('')
    expect(searchBox()).toHaveFocus()
    expect(markerNames()).toHaveLength(total)
  })

  it('stays on the page when Enter is pressed', async () => {
    const user = userEvent.setup()
    const { router } = await openMap()
    await user.type(searchBox(), 'kayak{Enter}')
    expect(router.state.location.pathname).toBe('/')
    expect(markerNames()).toEqual(['Location de kayaks exemple, Activités'])
  })

  it('closes the card when its record is searched away', async () => {
    const user = userEvent.setup()
    await openMap()
    await user.click(screen.getByRole('button', { name: MUSEUM }))
    expect(screen.getByRole('dialog', { name: 'Musée du Haut-Richelieu' })).toBeInTheDocument()

    await user.type(searchBox(), 'mus')
    expect(screen.getByRole('dialog', { name: 'Musée du Haut-Richelieu' })).toBeInTheDocument()
    await user.type(searchBox(), 'x')
    expect(selectionStore.getState().selected).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is translated', async () => {
    const user = userEvent.setup()
    await act(() => i18n.changeLanguage('en'))
    try {
      renderRoute('/')
      await screen.findByRole('button', { name: 'Musée du Haut-Richelieu, Things to do' })
      const box = within(screen.getByRole('search', { name: 'Search' })).getByRole('searchbox', {
        name: 'Search places, things to do and events',
      })
      expect(box).toHaveAttribute('placeholder', 'Search…')
      await user.type(box, 'kayak')
      expect(screen.getByRole('status')).toHaveTextContent('1 result')
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
    } finally {
      await act(() => i18n.changeLanguage('fr'))
    }
  })
})

describe('search in the list', () => {
  it('filters sections and counts, leaving out categories without a match', async () => {
    const user = userEvent.setup()
    renderRoute('/list')
    expect(await listHeadings()).toHaveLength(4)

    await user.type(searchBox(), 'parc')
    expect(await listHeadings()).toEqual(['Entreprises (1)', 'Activités (2)'])
    expect(screen.getByRole('status')).toHaveTextContent('3 éléments affichés')
  })

  it('shows "no results" with a button that clears the search', async () => {
    const user = userEvent.setup()
    renderRoute('/list')
    await listHeadings()

    await user.type(searchBox(), 'introuvable')
    expect(screen.getByRole('status')).toHaveTextContent('Aucun résultat pour « introuvable ».')
    expect(screen.queryAllByRole('heading', { level: 3 })).toEqual([])

    const clear = screen.getAllByRole('button', { name: 'Effacer la recherche' })
    // One in the box, one under the message.
    expect(clear).toHaveLength(2)
    await user.click(clear[1]!)
    expect(await listHeadings()).toHaveLength(4)
    expect(searchBox()).toHaveValue('')
  })

  it('combines with the layers', async () => {
    const user = userEvent.setup()
    renderRoute('/list?layers=activities')
    await listHeadings()
    await user.type(searchBox(), 'parc')
    expect(await listHeadings()).toEqual(['Activités (2)'])
  })
})

describe('search in the URL', () => {
  it('applies the search of a shared link', async () => {
    renderRoute('/list?q=Mus%C3%A9e')
    expect(await listHeadings()).toEqual(['Activités (1)'])
    expect(searchBox()).toHaveValue('Musée')
    expect(filterStore.getState().query).toBe('Musée')
  })

  it('writes what is typed into q, replacing the history entry, and removes it when cleared', async () => {
    const user = userEvent.setup()
    const { router } = await openMap()
    expect(searchParam(router)).toBeNull()

    await user.type(searchBox(), 'kayak bleu')
    await waitFor(() => expect(searchParam(router)).toBe('kayak bleu'))
    expect(router.state.historyAction).toBe('REPLACE')
    // Typing is never undone by the URL catching up.
    expect(searchBox()).toHaveValue('kayak bleu')

    await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))
    await waitFor(() => expect(router.state.location.search).toBe(''))
  })

  it('keeps the search from the map to the list and back', async () => {
    const user = userEvent.setup()
    const { router } = await openMap('/?q=parc', 'Parc riverain exemple, Activités')
    expect(markerNames()).toHaveLength(3)

    await user.click(screen.getByRole('link', { name: 'Liste' }))
    expect(await listHeadings()).toEqual(['Entreprises (1)', 'Activités (2)'])
    await waitFor(() => expect(searchParam(router)).toBe('parc'))

    await user.click(screen.getByRole('link', { name: 'Carte' }))
    await screen.findByRole('button', { name: 'Parc riverain exemple, Activités' })
    expect(markerNames()).toHaveLength(3)
    await waitFor(() => expect(searchParam(router)).toBe('parc'))
  })
})

describe('Show on map with a search', () => {
  it('clears a search the record does not match', async () => {
    const user = userEvent.setup()
    filterStore.getState().setQuery('kayak')
    const { router } = renderRoute('/events')
    await user.click(
      await screen.findByRole('button', { name: 'Voir sur la carte : Concert exemple' }),
    )
    expect(router.state.location.pathname).toBe('/')
    expect(filterStore.getState().query).toBe('')
    expect(await screen.findByRole('dialog', { name: 'Concert exemple' })).toBeInTheDocument()
  })

  it('keeps a search the record matches', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/list?q=parc')
    await listHeadings()
    await user.click(
      screen.getByRole('button', { name: 'Voir sur la carte : Parc riverain exemple' }),
    )
    expect(router.state.location.pathname).toBe('/')
    expect(filterStore.getState().query).toBe('parc')
    expect(await screen.findByRole('dialog', { name: 'Parc riverain exemple' })).toBeInTheDocument()
  })
})
