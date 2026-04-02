import { ROUTE } from '@/router/routes'
import { Flex, Typography } from '@/shared/ui'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/16/solid'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <Flex className="w-full h-screen" justify="center" align="center">
      <Flex direction="col" className="items-center space-y-2">
        <Typography variant="display" className="text-8xl font-light">
          404
        </Typography>
        <NavLink to={ROUTE.HOME} className="no-underline flex gap-1 text-foreground/60 transition-all hover:text-foreground">
          <ArrowLeftEndOnRectangleIcon className="size-6" />
          <Typography as="span" variant="small" tone="soft" className="text-lg">
            Return Home page
          </Typography>
        </NavLink>
      </Flex>
    </Flex>
  )
}

export default NotFound
