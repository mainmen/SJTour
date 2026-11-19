import { act, render, screen } from '@testing-library/react'
import type { Company } from '@/core/modules/companies/schema'
import { i18n } from '@/web/i18n'
import { CompanyCard } from '@/web/modules/companies/CompanyCard'

const park: Company = {
  id: 'parc',
  category: 'companies',
  name: { fr: 'Parc', en: 'Park' },
  description: { fr: 'Un parc industriel.', en: 'An industrial park.' },
  coordinates: [45.32, -73.23],
  lastVerified: '2026-11-19',
  sample: true,
  address: '1 rue Exemple, Saint-Jean-sur-Richelieu',
  website: 'https://example.com/parc',
  sector: 'manufacturing',
  kind: 'park',
}

describe('CompanyCard', () => {
  it('shows the kind, sector, description, address, website and verified date in French', () => {
    render(<CompanyCard record={park} />)
    expect(screen.getByText("Parc industriel ou quartier d'affaires")).toBeInTheDocument()
    expect(screen.getByText('Fabrication')).toBeInTheDocument()
    expect(screen.getByText('Un parc industriel.')).toBeInTheDocument()
    expect(screen.getByText('1 rue Exemple, Saint-Jean-sur-Richelieu')).toBeInTheDocument()
    expect(screen.getByText('Vérifié le 19 novembre 2026')).toBeInTheDocument()
    expect(screen.getByText("Donnée d'exemple")).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /example\.com/ })
    expect(link).toHaveAttribute('href', 'https://example.com/parc')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAccessibleName("example.com (s'ouvre dans un nouvel onglet)")
  })

  it('switches to English', async () => {
    render(<CompanyCard record={park} />)
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByText('Business park or district')).toBeInTheDocument()
    expect(screen.getByText('Manufacturing')).toBeInTheDocument()
    expect(screen.getByText('An industrial park.')).toBeInTheDocument()
    expect(screen.getByText('Last verified November 19, 2026')).toBeInTheDocument()
    expect(screen.getByText('Sample data')).toBeInTheDocument()
  })

  it('omits the sample badge, address and website when absent', () => {
    const { sample: _sample, address: _address, website: _website, ...rest } = park
    void [_sample, _address, _website]
    render(<CompanyCard record={{ ...rest }} />)
    expect(screen.queryByText("Donnée d'exemple")).toBeNull()
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.queryByRole('definition')).toBeNull()
  })
})
