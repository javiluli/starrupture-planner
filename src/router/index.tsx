import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/root-layout'
import { PagePlanner, NotFound, PageItems, PageSketch } from '@/pages'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <PagePlanner />,
      },
      {
        path: '/items',
        element: <PageItems />,
      },
      {
        path: '/sketch',
        element: <PageSketch />,
      },
    ],
  },
])
