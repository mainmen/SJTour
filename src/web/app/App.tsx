import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { routes } from '@/web/app/routes'

// The app may be served from a sub-path (GitHub Pages: `/<repo>/`).
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
})

function App() {
  return <RouterProvider router={router} />
}

export default App
