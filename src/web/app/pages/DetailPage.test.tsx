import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { stubDataFetch } from '@/test/data'
import { renderRoute } from '@/web/app/renderRoute'
import { filterStore, selectionStore } from '@/web/state/stores'

// Leaflet needs a size when "Show on map" opens the map.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.restoreAllMocks()
  // Remove a share stub defined by a test.
  if (Object.getOwnPropertyDescriptor(navigator, 'share')) {
    Reflect.deleteProperty(navigator, 'share')
  }
})

function findTitle(name: string) {
  return screen.findByRole('heading', { level: 2, name })
}

describe('DetailPage', () => {
  it('shows a record from a deep link, with its card and category', async () => {
    renderRoute('/companies/boulangerie-exemple')
    expect(await findTitle('Boulangerie exemple')).toBeInTheDocument()
    const article = screen.getByRole('article', { name: 'Boulangerie exemple' })
    expect(within(article).getByText('Entreprises')).toBeInTheDocument()
    expect(within(article).getByText('Alimentation')).toBeInTheDocument()
    expect(within(article).getByText(/^Vérifié le /)).toBeInTheDocument()
    expect(document.title).toBe('Boulangerie exemple — StJeanTour')
  })

  it('shows a trail with its facts', async () => {
    renderRoute('/trails/piste-du-canal-de-chambly')
    expect(await findTitle('Piste du canal de Chambly (Route verte)')).toBeInTheDocument()
    expect(screen.getByText('Longueur')).toBeInTheDocument()
    expect(screen.getByText('Gravier')).toBeInTheDocument()
  })

  it('hands directions off to Google Maps with only the destination', async () => {
    renderRoute('/activities/musee-du-haut-richelieu')
    await findTitle('Musée du Haut-Richelieu')
    const link = screen.getByRole('link', { name: /Itinéraire/ })
    expect(link).toHaveAccessibleName("Itinéraire (ouvre l'application de cartes)")
    expect(link).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=45.3069%2C-73.2546',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('hands directions off to Apple Maps on Apple devices', async () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
    )
    renderRoute('/activities/musee-du-haut-richelieu')
    await findTitle('Musée du Haut-Richelieu')
    expect(screen.getByRole('link', { name: /Itinéraire/ })).toHaveAttribute(
      'href',
      'https://maps.apple.com/?daddr=45.3069%2C-73.2546',
    )
  })

  it('shares the page URL with the share sheet when there is one', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    const user = userEvent.setup()
    renderRoute('/companies/boulangerie-exemple')
    await findTitle('Boulangerie exemple')
    await user.click(screen.getByRole('button', { name: 'Partager' }))
    expect(share).toHaveBeenCalledWith({
      title: 'Boulangerie exemple',
      url: window.location.href,
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('copies the link when there is no share sheet', async () => {
    const user = userEvent.setup()
    renderRoute('/companies/boulangerie-exemple')
    await findTitle('Boulangerie exemple')
    await user.click(screen.getByRole('button', { name: 'Partager' }))
    expect(await screen.findByText('Lien copié dans le presse-papiers.')).toBeInTheDocument()
    expect(await navigator.clipboard.readText()).toBe(window.location.href)
  })

  it('"Show on map" switches the hidden layer back on and opens the card on the map', async () => {
    filterStore.getState().setEnabled(['events'])
    const user = userEvent.setup()
    const { router } = renderRoute('/companies/boulangerie-exemple')
    await findTitle('Boulangerie exemple')
    await user.click(screen.getByRole('button', { name: 'Voir sur la carte' }))
    expect(router.state.location.pathname).toBe('/')
    expect(filterStore.getState().enabled).toEqual(['companies', 'events'])
    expect(selectionStore.getState().selected).toEqual({
      category: 'companies',
      id: 'boulangerie-exemple',
      origin: 'list',
    })
    expect(await screen.findByRole('dialog', { name: 'Boulangerie exemple' })).toBeInTheDocument()
  })

  it('says so when the record does not exist', async () => {
    renderRoute('/companies/nope')
    expect(await findTitle('Fiche introuvable')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute('href', '/')
  })

  it('shows the not-found page for an unknown category', async () => {
    renderRoute('/nope/boulangerie-exemple')
    expect(await findTitle('Page introuvable')).toBeInTheDocument()
  })

  it('shows an alert when the category fails to load, and Retry recovers', async () => {
    stubDataFetch({ 'data/companies.json': new TypeError('Failed to fetch') })
    const user = userEvent.setup()
    renderRoute('/companies/boulangerie-exemple')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Impossible de charger cette fiche.')
    stubDataFetch()
    await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))
    expect(await findTitle('Boulangerie exemple')).toBeInTheDocument()
  })

  it('goes back to the map when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/companies/boulangerie-exemple')
    await findTitle('Boulangerie exemple')
    await user.click(screen.getByRole('button', { name: 'Retour' }))
    expect(router.state.location.pathname).toBe('/')
  })

  it('is reached from the map card, and Back returns to the map', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/')
    await user.click(
      await screen.findByRole('button', { name: 'Boulangerie exemple, Entreprises' }),
    )
    const sheet = screen.getByRole('dialog', { name: 'Boulangerie exemple' })
    const details = within(sheet).getByRole('link', {
      name: 'Fiche complète : Boulangerie exemple',
    })
    expect(details).toHaveAttribute('href', '/companies/boulangerie-exemple')
    await user.click(details)
    expect(await findTitle('Boulangerie exemple')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retour' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('is reached from an event name in the events list', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-19T12:00:00-05:00'))
    try {
      const user = userEvent.setup()
      const { router } = renderRoute('/events')
      await user.click(await screen.findByRole('link', { name: 'Concert exemple' }))
      expect(router.state.location.pathname).toBe('/events/concert-exemple')
      expect(await findTitle('Concert exemple')).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
