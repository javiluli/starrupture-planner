import type { Building } from '@/shared/@types/building.type'

export const getRecipesSummary = (buildings: Building[]) => {
  const buildingsWithRecipes = buildings.filter((building) => (building.recipes?.length ?? 0) > 0)
  const recipesCount = buildingsWithRecipes.reduce((acc, building) => acc + (building.recipes?.length ?? 0), 0)

  return {
    buildingsCount: buildingsWithRecipes.length,
    recipesCount,
  }
}
