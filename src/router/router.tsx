import RootLayout from '@/layouts/root-layout'
import { PageCorporations, PageItems, PagePlanner, PageRecipes } from '@/pages'
import { NotFound } from '@/pages/not-found'
import PageDevUI from '@/pages/pagedevui/page-dev-ui'
import { ROUTE } from '@/router/routes'
import { createBrowserRouter } from 'react-router-dom'

const devRoutes = import.meta.env.DEV
  ? [
      {
        path: '/dev/ui',
        element: <PageDevUI />,
      },
    ]
  : []

export const productionRoutes = [
  {
    path: ROUTE.HOME,
    element: <PagePlanner />,
    label: '📐 Planner',
  },
  {
    path: ROUTE.ITEMS,
    element: <PageItems />,
    label: '📦 Items',
  },
  {
    path: ROUTE.RECIPES,
    element: <PageRecipes />,
    label: '🏭 Buildings',
  },
  {
    path: ROUTE.CORPORATIONS,
    element: <PageCorporations />,
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
