import { useMemo } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { buildRecipesStats } from '../lib'

export const useRecipesStats = () => {
  const buildings = useDataStore(dataSelectors.buildings)

  return useMemo(() => buildRecipesStats(buildings), [buildings])
}
