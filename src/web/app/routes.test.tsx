import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/web/app/renderRoute'
import { i18n } from '@/web/i18n'

const pages = [
  { path: '/', title: i18n.t('pages.map.title'), navLabel: i18n.t('nav.map') },
  { path: '/events', title: i18n.t('pages.events.title'), navLabel: i18n.t('nav.events') },
  { path: '/list', title: i18n.t('pages.list.title'), navLabel: i18n.t('nav.list') },
  { path: '/about', title: i18n.t('pages.about.title'), navLabel: i18n.t('nav.about') },
]

/** Awaits the page heading (the map page is lazy-loaded). */
function findPageHeading(name: string) {
  return within(screen.getByRole('main')).findByRole('heading', { level: 2, name })
}

function navLink(name: string) {
  return within(screen.getByRole('navigation')).getByRole('link', { name })
}

describe('routes', () => {
  it.each(pages)('renders the $path page', async ({ path, title }) => {
    renderRoute(path)
    expect(await findPageHeading(title)).toBeInTheDocument()
  })

  it('renders the not-found page for an unknown path', async () => {
    renderRoute('/does-not-exist')
    expect(await findPageHeading(i18n.t('pages.notFound.title'))).toBeInTheDocument()
    expect(screen.getByRole('link', { name: i18n.t('pages.notFound.backHome') })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it.each(pages)(
    'navigates to $path when its nav link is clicked',
    async ({ path, title, navLabel }) => {
      const user = userEvent.setup()
      // Start somewhere else so every click is a real navigation.
      const { router } = renderRoute(path === '/about' ? '/list' : '/about')
      await user.click(navLink(navLabel))
      expect(router.state.location.pathname).toBe(path)
      expect(await findPageHeading(title)).toBeInTheDocument()
    },
  )

  it.each(pages)('marks only the $path nav link as the current page', ({ path, navLabel }) => {
    renderRoute(path)
    for (const { navLabel: other } of pages) {
      const link = navLink(other)
      if (other === navLabel) expect(link).toHaveAttribute('aria-current', 'page')
      else expect(link).not.toHaveAttribute('aria-current')
    }
  })
})
