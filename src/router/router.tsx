import RootLayout from '@/layouts/root-layout'
import { ROUTE } from '@/router/routes'
import NotFound from '@/pages/not-found'
import PageItems from '@/pages/page-items'
import PagePlanner from '@/pages/page-planner'
import PageDevUI from '@/pages/pagedevui/page-dev-ui'
import { createBrowserRouter } from 'react-router-dom'

const devRoutes = import.meta.env.DEV
  ? [
      {
        path: '/dev/ui',
        element: <PageDevUI />,
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: ROUTE.HOME,
        element: <PagePlanner />,
      },
      {
        path: ROUTE.ITEMS,
        element: <PageItems />,
      },
      ...devRoutes,
    ],
  },
])
