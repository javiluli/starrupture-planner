import { ROUTE } from '@/router/routes'
import { Flex, Typography } from '@/shared/ui'
import { Button } from '@heroui/react'
import { NavLink } from 'react-router-dom'

export const NotFound = () => {
  return (
    <Flex className="w-full h-screen" justify="center" align="center">
      <Flex direction="col" className="items-center space-y-2">
        <Typography variant="display" className="text-9xl font-extralight">
          404
        </Typography>
        <Button as={NavLink} to={ROUTE.HOME}>
          Back to Planner page
        </Button>
      </Flex>
    </Flex>
  )
}
