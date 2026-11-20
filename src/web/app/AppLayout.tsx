import { useEffect, useRef, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useMatches } from 'react-router'
import { setDocumentTitle } from '@/web/adapters/documentTitle'
import { BottomNav } from '@/web/app/BottomNav'
import { Header } from '@/web/app/Header'

/** Translation keys of page names used in document titles. */
export type PageTitleKey =
  'pages.events.title' | 'pages.list.title' | 'pages.about.title' | 'pages.notFound.title'

/** Route `handle` flags read by the layout. */
export type LayoutHandle = {
  /** Content fills the whole viewport, under the glass header and nav (the map). */
  fullBleed?: boolean
  /**
   * The page's name in the document title ("List — StJeanTour"). `null` = the
   * app name alone (home). Routes without it (detail pages) set their own.
   */
  titleKey?: PageTitleKey | null
}

function layoutHandle(handle: unknown): LayoutHandle {
  return typeof handle === 'object' && handle !== null ? (handle as LayoutHandle) : {}
}

/** Gives each page its own document title (WCAG 2.4.2), in the active language. */
function useRouteTitle(titleKey: PageTitleKey | null | undefined) {
  const { t } = useTranslation()
  const title =
    titleKey === undefined
      ? null
      : titleKey === null
        ? t('appName')
        : t('detail.documentTitle', { name: t(titleKey), appName: t('appName') })
  useEffect(() => (title === null ? undefined : setDocumentTitle(title)), [title])
}

/**
 * After a navigation, focus that was on something the new page removed (a link
 * in the old page) goes to the main content instead of the top of the
 * document. Focus a page placed itself (e.g. the map's card) is left alone.
 */
function useKeepFocusOnNavigation(main: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const active = document.activeElement
    if (!active || active === document.body) main.current?.focus({ preventScroll: true })
  }, [pathname, main])
}

/**
 * Mobile-first shell: a skip link, header on top, bottom nav at the bottom.
 * Content fills the space between them, or, for full-bleed routes, the whole
 * viewport behind them so the glass panels float over it.
 */
export function AppLayout() {
  const { t } = useTranslation()
  const handles = useMatches().map((match) => layoutHandle(match.handle))
  const fullBleed = handles.some((handle) => handle.fullBleed === true)
  const titled = handles.findLast((handle) => handle.titleKey !== undefined)
  const mainRef = useRef<HTMLElement>(null)
  useRouteTitle(titled?.titleKey)
  useKeepFocusOnNavigation(mainRef)

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <a
        href="#main"
        onClick={(event) => {
          // Focus the content without changing the URL (the router owns it).
          event.preventDefault()
          mainRef.current?.focus()
        }}
        className="sr-only z-[2000] rounded-lg bg-surface px-4 py-3 font-semibold text-accent shadow focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus-visible:outline-2 focus-visible:outline-focus"
      >
        {t('nav.skip')}
      </a>
      <Header />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        data-layout={fullBleed ? 'full-bleed' : 'flow'}
        className={
          fullBleed
            ? 'absolute inset-0 z-0 outline-none'
            : 'relative min-h-0 flex-1 overflow-y-auto outline-none'
        }
      >
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
