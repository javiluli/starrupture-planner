import { RecipesAccordion, useRecipesSummary } from '@/features/recipes'
import { Flex, PageContainer, Panel, StatLabel, Typography } from '@/shared/ui'

const PageRecipes = () => {
  const stats = useRecipesSummary()

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
        <RecipesAccordion />
      </div>
    </PageContainer>
  )
}

export default PageRecipes
