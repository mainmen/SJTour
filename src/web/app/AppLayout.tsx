import { Outlet, useMatches } from 'react-router'
import { BottomNav } from '@/web/app/BottomNav'
import { Header } from '@/web/app/Header'

/** Route `handle` flags read by the layout. */
export type LayoutHandle = {
  /** Content fills the whole viewport, under the glass header and nav (the map). */
  fullBleed?: boolean
}

function isFullBleed(handle: unknown): boolean {
  return (
    typeof handle === 'object' && handle !== null && (handle as LayoutHandle).fullBleed === true
  )
}

/**
 * Mobile-first shell: header on top, bottom nav at the bottom. Content fills the
 * space between them, or, for full-bleed routes, the whole viewport behind them
 * so the glass panels float over it.
 */
export function AppLayout() {
  const fullBleed = useMatches().some((match) => isFullBleed(match.handle))
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <Header />
      <main
        data-layout={fullBleed ? 'full-bleed' : 'flow'}
        className={fullBleed ? 'absolute inset-0 z-0' : 'relative min-h-0 flex-1 overflow-y-auto'}
      >
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
