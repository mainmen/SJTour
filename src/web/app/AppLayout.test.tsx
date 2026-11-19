import { render, screen, within } from '@testing-library/react'
import { AppLayout } from '@/web/app/AppLayout'
import { strings } from '@/web/app/strings'

describe('AppLayout', () => {
  it('renders the header with the app name heading', () => {
    render(<AppLayout />)
    const header = screen.getByRole('banner')
    expect(
      within(header).getByRole('heading', { level: 1, name: strings.appName }),
    ).toBeInTheDocument()
  })

  it('renders a main landmark holding the page content', () => {
    render(<AppLayout>contenu</AppLayout>)
    expect(screen.getByRole('main')).toHaveTextContent('contenu')
  })

  it('renders a labeled navigation landmark with three text-labeled links', () => {
    render(<AppLayout />)
    const nav = screen.getByRole('navigation', { name: strings.nav.label })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      strings.nav.map,
      strings.nav.list,
      strings.nav.about,
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/', '/list', '/about'])
  })

  it('hides nav icons from assistive technology', () => {
    render(<AppLayout />)
    const nav = screen.getByRole('navigation')
    const icons = nav.querySelectorAll('svg')
    expect(icons).toHaveLength(3)
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'))
  })
})
