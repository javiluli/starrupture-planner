import RootLayout from '@/layouts/root-layout'
import { NotFound } from '@/pages/not-found'
import { PagePlanner } from '@/pages/page-planner'
import { RouteError } from '@/pages/route-error'
import { ROUTE } from '@/router/routes'
import { PageLoadingSkeleton } from '@/shared/ui'
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const PageItems = lazy(() => import('@/pages/page-items').then((m) => ({ default: m.PageItems })))
const PageRecipes = lazy(() => import('@/pages/page-recipes').then((m) => ({ default: m.PageRecipes })))
const PageCorporations = lazy(() => import('@/pages/page-corporations').then((m) => ({ default: m.PageCorporations })))
const PageBaseDesigner = lazy(() => import('@/pages/page-base-designer').then((m) => ({ default: m.PageBaseDesigner })))

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoadingSkeleton />}>
    <Component />
  </Suspense>
)

const devRoutes = import.meta.env.DEV
  ? [
      {
        path: '/dev/ui',
        element: withSuspense(lazy(() => import('@/pages/pagedevui/page-dev-ui'))),
      },
    ]
  : []

const productionRoutes = [
  {
    path: ROUTE.HOME,
    element: <PagePlanner />,
  },
  {
    path: ROUTE.ITEMS,
    element: withSuspense(PageItems),
  },
  {
    path: ROUTE.RECIPES,
    element: withSuspense(PageRecipes),
  },
  {
    path: ROUTE.CORPORATIONS,
    element: withSuspense(PageCorporations),
  },
  {
    path: ROUTE.MY_BASE,
    element: withSuspense(PageBaseDesigner),
  },
]

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        errorElement: <RouteError />,
        children: [...productionRoutes, ...devRoutes, { path: '*', element: <NotFound /> }],
      },
    ],
  },
])
