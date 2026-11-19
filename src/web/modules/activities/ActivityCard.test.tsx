import { act, render, screen } from '@testing-library/react'
import type { Activity } from '@/core/modules/activities/schema'
import { i18n } from '@/web/i18n'
import { ActivityCard } from '@/web/modules/activities/ActivityCard'

const museum: Activity = {
  id: 'musee',
  category: 'activities',
  name: { fr: 'Musée', en: 'Museum' },
  description: { fr: "Un musée d'histoire.", en: 'A history museum.' },
  coordinates: [45.3069, -73.2546],
  lastVerified: '2026-11-19',
  subcategory: 'culture',
}

describe('ActivityCard', () => {
  it('shows the subcategory badge and the shared details', () => {
    render(<ActivityCard record={museum} />)
    expect(screen.getByText('Culture et musées')).toBeInTheDocument()
    expect(screen.getByText("Un musée d'histoire.")).toBeInTheDocument()
    expect(screen.getByText('Vérifié le 19 novembre 2026')).toBeInTheDocument()
  })

  it('switches to English', async () => {
    render(<ActivityCard record={museum} />)
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByText('Culture & museums')).toBeInTheDocument()
    expect(screen.getByText('A history museum.')).toBeInTheDocument()
  })
})
