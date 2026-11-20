import type { RouteObject } from 'react-router'
import { AppLayout, type LayoutHandle } from '@/web/app/AppLayout'
import { AboutPage } from '@/web/app/pages/AboutPage'
import { DetailRoute } from '@/web/app/pages/DetailRoute'
import { EventsRoute } from '@/web/app/pages/EventsRoute'
import { ListRoute } from '@/web/app/pages/ListRoute'
import { MapRoute } from '@/web/app/pages/MapRoute'
import { NotFoundPage } from '@/web/app/pages/NotFoundPage'

/** The single route table, shared by the app (browser router) and tests (memory router). */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: MapRoute,
        handle: { fullBleed: true, titleKey: null } satisfies LayoutHandle,
      },
      {
        path: 'events',
        Component: EventsRoute,
        handle: { titleKey: 'pages.events.title' } satisfies LayoutHandle,
      },
      {
        path: 'list',
        Component: ListRoute,
        handle: { titleKey: 'pages.list.title' } satisfies LayoutHandle,
      },
      {
        path: 'about',
        Component: AboutPage,
        handle: { titleKey: 'pages.about.title' } satisfies LayoutHandle,
      },
      // A record's detail page; static paths above win over it.
      { path: ':category/:id', Component: DetailRoute },
      {
        path: '*',
        Component: NotFoundPage,
        handle: { titleKey: 'pages.notFound.title' } satisfies LayoutHandle,
      },
    ],
  },
]
