import { fireEvent, screen, within } from '@testing-library/react'
import { stubReducedMotion } from '@/test/matchMedia'
import { renderRoute } from '@/web/app/renderRoute'
import { i18n } from '@/web/i18n'

describe('AppLayout', () => {
  it('renders the header with the app name heading', () => {
    renderRoute('/')
    const header = screen.getByRole('banner')
    expect(
      within(header).getByRole('heading', { level: 1, name: i18n.t('appName') }),
    ).toBeInTheDocument()
  })

  it('renders the current page inside the main landmark', async () => {
    renderRoute('/')
    const main = screen.getByRole('main')
    expect(
      await within(main).findByRole('heading', { name: i18n.t('pages.map.title') }),
    ).toBeInTheDocument()
  })

  it('lays the map route out full-bleed, under the header and nav', async () => {
    renderRoute('/')
    expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'full-bleed')
    expect(screen.getByRole('main')).toHaveClass('absolute', 'inset-0')
    // Header and nav stay above the map.
    expect(screen.getByRole('banner')).toHaveClass('z-10')
    expect(screen.getByRole('navigation')).toHaveClass('z-10')
    await within(screen.getByRole('main')).findByRole('region', { name: i18n.t('map.label') })
  })

  it.each(['/events', '/list', '/about', '/does-not-exist'])(
    'keeps %s in the flow layout',
    (path) => {
      renderRoute(path)
      expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'flow')
      expect(screen.getByRole('main')).not.toHaveClass('absolute')
    },
  )

  it('renders a labeled navigation landmark with four text-labeled links', () => {
    renderRoute('/')
    const nav = screen.getByRole('navigation', { name: i18n.t('nav.label') })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      i18n.t('nav.map'),
      i18n.t('nav.events'),
      i18n.t('nav.list'),
      i18n.t('nav.about'),
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/', '/events', '/list', '/about'])
  })

  it('hides nav icons from assistive technology', () => {
    renderRoute('/')
    const icons = screen.getByRole('navigation').querySelectorAll('svg')
    expect(icons).toHaveLength(4)
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'))
  })

  it('renders the header and nav as glass panels', () => {
    renderRoute('/')
    expect(screen.getByRole('banner')).toHaveClass('glass')
    expect(screen.getByRole('navigation', { name: i18n.t('nav.label') })).toHaveClass('glass')
  })

  it('shows a decorative ripple when a nav link is pressed (motion allowed)', () => {
    stubReducedMotion(false)
    renderRoute('/')
    const link = screen.getByRole('link', { name: i18n.t('nav.list') })
    fireEvent.pointerDown(link, { clientX: 5, clientY: 5 })
    const ripples = link.querySelectorAll('[data-ripple]')
    expect(ripples).toHaveLength(1)
    expect(ripples[0]).toHaveAttribute('aria-hidden', 'true')
    expect(link).toHaveAccessibleName(i18n.t('nav.list'))
  })

  it('shows no ripple on a nav link under reduced motion', () => {
    stubReducedMotion(true)
    renderRoute('/')
    const link = screen.getByRole('link', { name: i18n.t('nav.list') })
    fireEvent.pointerDown(link)
    expect(link.querySelectorAll('[data-ripple]')).toHaveLength(0)
  })
})
