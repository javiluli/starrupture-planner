import { buildings, corporationsByName, itemById } from '@/shared/data'
import { getBuildingUnlockInfo } from '../lib/building-unlock'
import { hasRecipes } from '../lib/has-recipes'

const buildingsWithRecipes = buildings.filter(hasRecipes)
const unlockInfoByBuilding = new Map<string, ReturnType<typeof getBuildingUnlockInfo>>(
  buildingsWithRecipes.map((building) => [building.name, getBuildingUnlockInfo(corporationsByName, building.name)] as const),
)

export const useRecipesAccordionData = () => {
  return {
    buildingsWithRecipes,
    itemMap: itemById,
    getUnlockInfo: (buildingName: string) => unlockInfoByBuilding.get(buildingName) ?? null,
  }
}
