import { fireEvent, screen, within } from '@testing-library/react'
import { stubReducedMotion } from '@/test/matchMedia'
import { renderRoute } from '@/web/app/renderRoute'
import { strings } from '@/web/app/strings'

describe('AppLayout', () => {
  it('renders the header with the app name heading', () => {
    renderRoute('/')
    const header = screen.getByRole('banner')
    expect(
      within(header).getByRole('heading', { level: 1, name: strings.appName }),
    ).toBeInTheDocument()
  })

  it('renders the current page inside the main landmark', () => {
    renderRoute('/')
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { name: strings.pages.map.title })).toBeInTheDocument()
  })

  it('renders a labeled navigation landmark with three text-labeled links', () => {
    renderRoute('/')
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
    renderRoute('/')
    const icons = screen.getByRole('navigation').querySelectorAll('svg')
    expect(icons).toHaveLength(3)
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'))
  })

  it('renders the header and nav as glass panels', () => {
    renderRoute('/')
    expect(screen.getByRole('banner')).toHaveClass('glass')
    expect(screen.getByRole('navigation', { name: strings.nav.label })).toHaveClass('glass')
  })

  it('shows a decorative ripple when a nav link is pressed (motion allowed)', () => {
    stubReducedMotion(false)
    renderRoute('/')
    const link = screen.getByRole('link', { name: strings.nav.list })
    fireEvent.pointerDown(link, { clientX: 5, clientY: 5 })
    const ripples = link.querySelectorAll('[data-ripple]')
    expect(ripples).toHaveLength(1)
    expect(ripples[0]).toHaveAttribute('aria-hidden', 'true')
    expect(link).toHaveAccessibleName(strings.nav.list)
  })

  it('shows no ripple on a nav link under reduced motion', () => {
    stubReducedMotion(true)
    renderRoute('/')
    const link = screen.getByRole('link', { name: strings.nav.list })
    fireEvent.pointerDown(link)
    expect(link.querySelectorAll('[data-ripple]')).toHaveLength(0)
  })
})
