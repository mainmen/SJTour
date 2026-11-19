import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/web/app/renderRoute'
import { i18n } from '@/web/i18n'

// Leaflet needs a size when a test lands on the map.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('skip link', () => {
  it('is the first tab stop and moves focus to the main content', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/about')
    await user.tab()
    const skip = screen.getByRole('link', { name: 'Aller au contenu' })
    expect(skip).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('main')).toHaveFocus()
    // The router keeps the URL as it was.
    expect(router.state.location.hash).toBe('')
  })
})

describe('document titles', () => {
  it.each([
    ['/', 'StJeanTour'],
    ['/list', 'Liste — StJeanTour'],
    ['/events', 'Événements — StJeanTour'],
    ['/about', 'À propos — StJeanTour'],
    ['/nope', 'Page introuvable — StJeanTour'],
  ])('names %s "%s"', async (path, title) => {
    renderRoute(path)
    await waitFor(() => expect(document.title).toBe(title))
  })

  it('follows the language and the navigation', async () => {
    const user = userEvent.setup()
    renderRoute('/about')
    await user.click(screen.getByRole('link', { name: 'Liste' }))
    await waitFor(() => expect(document.title).toBe('Liste — StJeanTour'))
    await act(() => i18n.changeLanguage('en'))
    try {
      expect(document.title).toBe('List — StJeanTour')
    } finally {
      await act(() => i18n.changeLanguage('fr'))
    }
  })

  it('lets a detail page set its own', async () => {
    renderRoute('/activities/musee-du-haut-richelieu')
    await waitFor(() => expect(document.title).toBe('Musée du Haut-Richelieu — StJeanTour'))
  })
})

describe('focus after navigation', () => {
  it('goes to the main content when the focused link left the page', async () => {
    const user = userEvent.setup()
    renderRoute('/list')
    const link = await screen.findByRole('link', { name: 'Musée du Haut-Richelieu' })
    await user.click(link)
    await screen.findByRole('heading', { level: 2, name: 'Musée du Haut-Richelieu' })
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('stays on a nav link that is still on screen', async () => {
    const user = userEvent.setup()
    renderRoute('/about')
    const nav = screen.getByRole('link', { name: 'Liste' })
    await user.click(nav)
    expect(nav).toHaveFocus()
  })
})
