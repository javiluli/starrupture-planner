import { useMemo } from 'react'
import type { Building } from '@/shared/@types/building.type'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { buildingHasRecipes } from '../lib'

export const useBuildingsWithRecipes = (): Building[] => {
  const buildings = useDataStore(dataSelectors.buildings)

  return useMemo(() => buildings.filter(buildingHasRecipes), [buildings])
}
