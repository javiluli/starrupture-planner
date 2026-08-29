import RootLayout from '@/layouts/root-layout'
import { NotFound } from '@/pages/not-found'
import { ROUTE } from '@/router/routes'
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const PagePlanner = lazy(() => import('@/pages/page-planner').then((m) => ({ default: m.PagePlanner })))
const PageItems = lazy(() => import('@/pages/page-items').then((m) => ({ default: m.PageItems })))
const PageRecipes = lazy(() => import('@/pages/page-recipes').then((m) => ({ default: m.PageRecipes })))
const PageCorporations = lazy(() => import('@/pages/page-corporations').then((m) => ({ default: m.PageCorporations })))
const PageDevUI = lazy(() => import('@/pages/pagedevui/page-dev-ui'))

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-0 flex-1" />}>
    <Component />
  </Suspense>
)

const devRoutes = import.meta.env.DEV
  ? [
      {
        path: '/dev/ui',
        element: withSuspense(PageDevUI),
      },
    ]
  : []

export const productionRoutes = [
  {
    path: ROUTE.HOME,
    element: withSuspense(PagePlanner),
    label: '📐 Planner',
  },
  {
    path: ROUTE.ITEMS,
    element: withSuspense(PageItems),
    label: '📦 Items',
  },
  {
    path: ROUTE.RECIPES,
    element: withSuspense(PageRecipes),
    label: '🏭 Buildings',
  },
  {
    path: ROUTE.CORPORATIONS,
    element: withSuspense(PageCorporations),
    label: '🏢 Corporations',
  },
]

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [...productionRoutes, ...devRoutes],
  },
])
