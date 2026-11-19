import { screen, within } from '@testing-library/react'
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
})
