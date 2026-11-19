import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LAYER_IDS } from '@/core/filters/layers'
import { renderRoute } from '@/web/app/renderRoute'
import { filterStore } from '@/web/state/stores'

// Leaflet needs a size to lay out the map.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(360)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(640)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function layersParam(router: ReturnType<typeof renderRoute>['router']) {
  return new URLSearchParams(router.state.location.search).get('layers')
}

function chip(name: string) {
  return within(screen.getByRole('group', { name: 'Couches de la carte' })).getByRole('button', {
    name,
  })
}

describe('filters in the URL', () => {
  it('applies the layers of a shared link', async () => {
    const { router } = renderRoute('/?layers=companies,walking')
    await screen.findByRole('group', { name: 'Couches de la carte' })
    expect(filterStore.getState().enabled).toEqual(['companies', 'walking'])
    expect(chip('Entreprises')).toHaveAttribute('aria-pressed', 'true')
    expect(chip('Activités')).toHaveAttribute('aria-pressed', 'false')
    expect(await screen.findAllByRole('button', { name: /, Entreprises$/ })).toHaveLength(6)
    expect(screen.queryAllByRole('button', { name: /, Activités$/ })).toHaveLength(0)
    expect(layersParam(router)).toBe('companies,walking')
  })

  it('writes toggled layers into the URL, replacing the history entry', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/')
    await screen.findByRole('group', { name: 'Couches de la carte' })
    expect(router.state.location.search).toBe('')

    await user.click(chip('Événements'))
    await waitFor(() => expect(layersParam(router)).toBe('companies,activities,walking,biking'))
    expect(router.state.historyAction).toBe('REPLACE')

    await user.click(chip('Événements'))
    await waitFor(() => expect(router.state.location.search).toBe(''))
  })

  it('keeps an empty selection as an empty parameter', async () => {
    const { router } = renderRoute('/?layers=')
    await screen.findByRole('group', { name: 'Couches de la carte' })
    expect(filterStore.getState().enabled).toEqual([])
    expect(layersParam(router)).toBe('')
  })

  it('drops a parameter that names no known layer', async () => {
    const { router } = renderRoute('/?layers=nope')
    await screen.findByRole('group', { name: 'Couches de la carte' })
    await waitFor(() => expect(router.state.location.search).toBe(''))
    expect(filterStore.getState().enabled).toEqual(LAYER_IDS)
  })

  it('keeps the filters when coming back through the nav', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/?layers=events')
    await screen.findByRole('group', { name: 'Couches de la carte' })
    await user.click(screen.getByRole('link', { name: 'À propos' }))
    expect(router.state.location.pathname).toBe('/about')
    await user.click(screen.getByRole('link', { name: 'Carte' }))
    await waitFor(() => expect(layersParam(router)).toBe('events'))
    expect(filterStore.getState().enabled).toEqual(['events'])
  })
})
