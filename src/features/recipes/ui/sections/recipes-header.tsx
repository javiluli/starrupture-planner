import { Flex, Panel, Typography } from '@/shared/ui'
import { useRecipesStats } from '../../hooks'

export const RecipesHeader = () => {
  const stats = useRecipesStats()

  return (
    <Panel padding="sm">
      <Flex align="center" justify="between" gap="lg" wrap="wrap">
        <Typography as="h1" variant="h1">
          Buildings & Recipes
        </Typography>
        <Flex gap="md" align="center">
          <Typography as="span" variant="h3">
            {stats.buildingsCount}{' '}
            <Typography as="span" tone="soft">
              Buildings
            </Typography>
          </Typography>

          <Typography as="span" variant="h3">
            {stats.recipesCount}{' '}
            <Typography as="span" tone="soft">
              Recipes
            </Typography>
          </Typography>
        </Flex>
      </Flex>
    </Panel>
  )
}
