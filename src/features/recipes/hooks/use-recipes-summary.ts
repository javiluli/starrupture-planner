import { useMemo } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { getRecipesSummary } from '../lib'

export const useRecipesSummary = () => {
  const buildings = useDataStore(dataSelectors.buildings)

  return useMemo(() => getRecipesSummary(buildings), [buildings])
}
