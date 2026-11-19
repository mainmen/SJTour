import { act, render, screen, within } from '@testing-library/react'
import type { Trail } from '@/core/modules/trails/schema'
import { i18n } from '@/web/i18n'
import { TrailCard } from '@/web/modules/trails/TrailCard'

const canal: Trail = {
  id: 'canal',
  category: 'trails',
  name: { fr: 'Canal', en: 'Canal' },
  description: { fr: 'Un chemin de halage.', en: 'A towpath.' },
  coordinates: [45.44, -73.28],
  lastVerified: '2026-11-19',
  sample: true,
  geometry: {
    type: 'LineString',
    coordinates: [
      [-73.28, 45.44],
      [-73.27, 45.4],
    ],
  },
  lengthKm: 15.1,
  type: 'both',
  difficulty: 'easy',
  surface: 'gravel',
  network: 'route-verte',
}

/** The value shown for a fact term in the card's description list. */
function fact(term: string) {
  const dt = screen.getByText(term, { selector: 'dt' })
  return within(dt.parentElement!).getByRole('definition').textContent
}

describe('TrailCard', () => {
  it('shows the type, network, length, difficulty and surface in French', () => {
    render(<TrailCard record={canal} />)
    expect(screen.getByText('Marche et vélo')).toBeInTheDocument()
    expect(screen.getByText('Route verte')).toBeInTheDocument()
    expect(fact('Longueur')).toBe('15,1 km')
    expect(fact('Difficulté')).toBe('Facile')
    expect(fact('Revêtement')).toBe('Gravier')
    expect(screen.getByText('Un chemin de halage.')).toBeInTheDocument()
    expect(screen.getByText("Donnée d'exemple")).toBeInTheDocument()
  })

  it('switches to English', async () => {
    render(<TrailCard record={canal} />)
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByText('Walking and biking')).toBeInTheDocument()
    expect(fact('Length')).toBe('15.1 km')
    expect(fact('Difficulty')).toBe('Easy')
    expect(fact('Surface')).toBe('Gravel')
  })

  it('omits the network badge when the trail has none', () => {
    const { network: _network, ...rest } = canal
    void _network
    render(<TrailCard record={{ ...rest, type: 'walk' }} />)
    expect(screen.getByText('Marche')).toBeInTheDocument()
    expect(screen.queryByText('Route verte')).toBeNull()
  })
})
