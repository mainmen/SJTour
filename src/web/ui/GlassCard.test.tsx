import { render, screen } from '@testing-library/react'
import { GlassCard, type GlassTag } from '@/web/ui/GlassCard'

describe('GlassCard', () => {
  it('renders a div with the glass styling by default', () => {
    render(<GlassCard data-testid="card">Contenu</GlassCard>)
    const card = screen.getByTestId('card')
    expect(card.tagName).toBe('DIV')
    expect(card).toHaveClass('glass')
    expect(card).toHaveTextContent('Contenu')
  })

  it.each<GlassTag>(['div', 'section', 'article', 'header', 'nav', 'aside'])(
    'renders as <%s>',
    (tag) => {
      render(<GlassCard as={tag} data-testid="card" />)
      expect(screen.getByTestId('card').tagName).toBe(tag.toUpperCase())
    },
  )

  it('keeps landmark semantics, e.g. a labeled navigation', () => {
    render(<GlassCard as="nav" aria-label="Principale" />)
    expect(screen.getByRole('navigation', { name: 'Principale' })).toBeInTheDocument()
  })

  it('merges className and forwards other props', () => {
    render(<GlassCard className="rounded-2xl p-4" id="panel" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('glass', 'rounded-2xl', 'p-4')
    expect(card).toHaveAttribute('id', 'panel')
  })
})
