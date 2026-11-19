import type { RouteObject } from 'react-router'
import { AppLayout } from '@/web/app/AppLayout'
import { AboutPage } from '@/web/app/pages/AboutPage'
import { ListPage } from '@/web/app/pages/ListPage'
import { MapPage } from '@/web/app/pages/MapPage'
import { NotFoundPage } from '@/web/app/pages/NotFoundPage'

/** The single route table, shared by the app (browser router) and tests (memory router). */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: MapPage },
      { path: 'list', Component: ListPage },
      { path: 'about', Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
