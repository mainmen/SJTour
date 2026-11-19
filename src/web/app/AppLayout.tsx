import { Outlet } from 'react-router'
import { BottomNav } from '@/web/app/BottomNav'
import { Header } from '@/web/app/Header'

/**
 * Mobile-first shell: header on top, bottom nav at the bottom, and a content
 * area that fills the space between (ready to host a full-screen map).
 */
export function AppLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <main className="relative min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
