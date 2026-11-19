import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readDataFile } from '@/core/test/dataFiles'
import { stubDataFetch } from '@/test/data'
import { renderRoute } from '@/web/app/renderRoute'
import { selectionStore } from '@/web/state/stores'

// The shipped events were seeded relative to this day (noon, Montreal).
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-19T12:00:00-05:00'))
  // Leaflet needs a size when "Show on map" opens the map.
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

async function findTabs() {
  const tablist = await screen.findByRole('tablist', { name: 'Période' })
  return {
    upcoming: within(tablist).getByRole('tab', { name: 'À venir' }),
    recent: within(tablist).getByRole('tab', { name: 'Récents' }),
  }
}

/** Names of the events listed in the visible tab panel. */
function listedEvents() {
  const panel = screen.getByRole('tabpanel')
  return within(panel)
    .queryAllByRole('article')
    .map((article) => within(article).getByRole('heading', { level: 3 }).textContent)
}

describe('EventsPage', () => {
  it('lists upcoming events by default, soonest first', async () => {
    renderRoute('/events')
    const { upcoming, recent } = await findTabs()
    expect(upcoming).toHaveAttribute('aria-selected', 'true')
    expect(recent).toHaveAttribute('aria-selected', 'false')
    expect(listedEvents()).toEqual([
      'Marché de Noël exemple',
      'Concert exemple',
      "L'International de montgolfières",
    ])
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('À venir')
  })

  it('shows formatted dates on each event', async () => {
    renderRoute('/events')
    await findTabs()
    const concert = screen.getByRole('article', { name: 'Concert exemple' })
    expect(within(concert).getByText(/sam\. 5 décembre 2026, 19 h 30/)).toHaveAttribute(
      'datetime',
      '2026-12-05T19:30:00-05:00',
    )
  })

  it('lists recently ended events in the Recent tab, never past ones', async () => {
    const user = userEvent.setup()
    renderRoute('/events')
    const { recent } = await findTabs()
    await user.click(recent)
    expect(recent).toHaveAttribute('aria-selected', 'true')
    expect(listedEvents()).toEqual(["Marché d'automne exemple", 'Course à pied exemple'])
    expect(screen.queryByText('Fête de la rentrée exemple')).toBeNull()
  })

  it('moves between tabs with the arrow keys, Home and End (roving tabindex)', async () => {
    const user = userEvent.setup()
    renderRoute('/events')
    const { upcoming, recent } = await findTabs()
    expect(upcoming).toHaveAttribute('tabindex', '0')
    expect(recent).toHaveAttribute('tabindex', '-1')

    upcoming.focus()
    await user.keyboard('{ArrowRight}')
    expect(recent).toHaveFocus()
    expect(recent).toHaveAttribute('aria-selected', 'true')
    expect(recent).toHaveAttribute('tabindex', '0')
    expect(upcoming).toHaveAttribute('tabindex', '-1')

    await user.keyboard('{ArrowRight}') // wraps
    expect(upcoming).toHaveFocus()
    await user.keyboard('{ArrowLeft}') // wraps back
    expect(recent).toHaveFocus()
    await user.keyboard('{Home}')
    expect(upcoming).toHaveFocus()
    await user.keyboard('{End}')
    expect(recent).toHaveFocus()
    expect(listedEvents()).toEqual(["Marché d'automne exemple", 'Course à pied exemple'])
  })

  it('shows a message when a tab is empty', async () => {
    const events = readDataFile('data/events.json') as { id: string }[]
    stubDataFetch({
      'data/events.json': events.filter((event) => event.id === 'fete-de-la-rentree-exemple'),
    })
    const user = userEvent.setup()
    renderRoute('/events')
    const { recent } = await findTabs()
    expect(screen.getByText('Aucun événement à venir pour le moment.')).toBeVisible()
    await user.click(recent)
    expect(
      screen.getByText('Aucun événement terminé au cours des 30 derniers jours.'),
    ).toBeVisible()
  })

  it('"Show on map" opens the map with the event selected and its card open', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/events')
    await findTabs()
    await user.click(screen.getByRole('button', { name: 'Voir sur la carte : Concert exemple' }))
    expect(router.state.location.pathname).toBe('/')
    expect(selectionStore.getState().selected).toEqual({
      category: 'events',
      id: 'concert-exemple',
      origin: 'list',
    })
    const sheet = await screen.findByRole('dialog', { name: 'Concert exemple' })
    expect(within(sheet).getByText('Événements')).toBeInTheDocument()
    expect(within(sheet).getByText('À venir')).toBeInTheDocument()
  })

  it('shows an alert when events fail to load, and Retry recovers', async () => {
    stubDataFetch({ 'data/events.json': new TypeError('Failed to fetch') })
    const user = userEvent.setup()
    renderRoute('/events')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Impossible de charger les événements.')
    stubDataFetch()
    await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
    expect(await findTabs()).toBeTruthy()
  })
})
