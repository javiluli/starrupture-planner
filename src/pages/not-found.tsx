import { ROUTE } from '@/router/routes'
import { Flex, PageContainer, PageContent, Typography } from '@/shared/ui'
import { Button } from '@heroui/react'
import { NavLink } from 'react-router-dom'

export const NotFound = () => {
  return (
    <PageContainer>
      <PageContent overflow="hidden">
        <Flex className="h-full" justify="center" align="center">
          <Flex direction="col" align="center">
            <Typography variant="display" className="text-9xl font-extralight">
              404
            </Typography>
            <Button as={NavLink} to={ROUTE.HOME}>
              Back to Planner page
            </Button>
          </Flex>
        </Flex>
      </PageContent>
    </PageContainer>
  )
}
