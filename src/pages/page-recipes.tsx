import { RecipesHeader, RecipesList } from '@/features/recipes'
import { PageContainer } from '@/shared/ui'

const PageRecipes = () => {
  return (
    <PageContainer>
      <RecipesHeader />

      <div className="flex-1 overflow-y-auto">
        <RecipesList />
      </div>
    </PageContainer>
  )
}

export default PageRecipes
