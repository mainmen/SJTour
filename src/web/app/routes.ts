import type { RouteObject } from 'react-router'
import { AppLayout, type LayoutHandle } from '@/web/app/AppLayout'
import { AboutPage } from '@/web/app/pages/AboutPage'
import { ListPage } from '@/web/app/pages/ListPage'
import { MapRoute } from '@/web/app/pages/MapRoute'
import { NotFoundPage } from '@/web/app/pages/NotFoundPage'

/** The single route table, shared by the app (browser router) and tests (memory router). */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: MapRoute, handle: { fullBleed: true } satisfies LayoutHandle },
      { path: 'list', Component: ListPage },
      { path: 'about', Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
