import RootLayout from '@/components/root-layout'
import { ROUTE } from '@/constants'
import { NotFound, PageItems, PagePlanner } from '@/pages'
import { createBrowserRouter } from 'react-router-dom'

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
      // {
      //   path: ROUTE.SKETCH,
      //   element: <PageSketch />,
      // },
    ],
  },
])
