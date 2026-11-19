import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/web/app/routes'

/** Test helper: render the real route table at `path` with an in-memory router. */
export function renderRoute(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return { router, ...render(<RouterProvider router={router} />) }
}
