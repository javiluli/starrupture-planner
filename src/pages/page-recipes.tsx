import { AccordionBuildingsWithRecipes } from '@/features/recipes'
import { useRecipesStats } from '@/features/recipes/hooks'
import { Flex, PageContainer, Panel, StatLabel, Typography } from '@/shared/ui'

const PageRecipes = () => {
  const stats = useRecipesStats()

  return (
    <PageContainer>
      <Panel padding="sm">
        <Flex align="center" justify="between" gap="lg" wrap="wrap">
          <Typography as="h1" variant="h2">
            Buildings & Recipes
          </Typography>
          <Flex gap="md" align="center">
            <StatLabel value={stats.buildingsCount} label="Building" />
            <StatLabel value={stats.recipesCount} label="Recipe" />
          </Flex>
        </Flex>
      </Panel>

      <div className="flex-1 overflow-y-auto">
        <AccordionBuildingsWithRecipes />
      </div>
    </PageContainer>
  )
}

export default PageRecipes
