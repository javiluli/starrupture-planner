import { ROUTE } from '@/constants'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/16/solid'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-8xl font-light">404</h1>
        <NavLink to={ROUTE.HOME} className="no-underline flex gap-1 text-lg text-foreground/60 transition-all hover:text-foreground">
          <ArrowLeftEndOnRectangleIcon className="size-6" />
          Return Home page
        </NavLink>
      </div>
    </div>
  )
}

export default NotFound
