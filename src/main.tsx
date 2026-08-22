import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { RouteError } from './pages/RouteError'

/**
 * Every page exists twice: Arabic at the root, English under /en/. The pages
 * themselves are shared components that read the language from the URL (see
 * src/hooks/useLang.ts), so the two trees differ only in their paths.
 */
function routesFor(prefix: '' | '/en') {
  return [
    { path: `${prefix}/`, element: <Home /> },
    // Everything past the home page is loaded on demand, so the first
    // visit ships only what the home page needs.
    {
      path: `${prefix}/lessons/:slug`,
      lazy: async () => ({ Component: (await import('./pages/LessonPage')).LessonPage }),
    },
    {
      path: `${prefix}/practice`,
      lazy: async () => ({ Component: (await import('./pages/Practice')).Practice }),
    },
    {
      path: `${prefix}/cheatsheet`,
      lazy: async () => ({ Component: (await import('./pages/Cheatsheet')).Cheatsheet }),
    },
    {
      path: `${prefix}/glossary`,
      lazy: async () => ({ Component: (await import('./pages/Glossary')).Glossary }),
    },
    {
      path: `${prefix}/about`,
      lazy: async () => ({ Component: (await import('./pages/About')).About }),
    },
  ]
}

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          // One error boundary for every page, nested *inside* the layout so
          // the header, footer and skip link survive: an errorElement replaces
          // the element of the route it sits on, so putting it on the layout
          // route would take the whole shell down with the page.
          //
          // The failure it exists for is a stale build — see RouteError.
          errorElement: <RouteError />,
          children: [...routesFor(''), ...routesFor('/en'), { path: '*', element: <NotFound /> }],
        },
      ],
    },
  ],
  // BASE_URL comes from `base` in vite.config.ts, itself from site.config.mjs.
  // It is '/why-islam/' on GitHub Pages and '/' on a custom domain, so every
  // link follows whichever the build was made for.
  { basename: import.meta.env.BASE_URL },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
