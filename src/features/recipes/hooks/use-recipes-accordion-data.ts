import { useMemo } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { getBuildingUnlockInfo, hasRecipes } from '../lib'
import { useItemMap } from '@/shared/hooks'

export const useRecipesAccordionData = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const corporations = useDataStore(dataSelectors.corporations)
  const itemMap = useItemMap()

  const buildingsWithRecipes = useMemo(() => buildings.filter(hasRecipes), [buildings])

  const unlockInfoByBuilding = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getBuildingUnlockInfo>>()

    buildingsWithRecipes.forEach((building) => {
      map.set(building.name, getBuildingUnlockInfo(corporations, building.name))
    })

    return map
  }, [buildingsWithRecipes, corporations])

  const getUnlockInfo = (buildingName: string) => unlockInfoByBuilding.get(buildingName) ?? null

  return {
    buildingsWithRecipes,
    itemMap,
    getUnlockInfo,
  }
}
