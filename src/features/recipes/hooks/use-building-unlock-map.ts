import { useMemo } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { buildBuildingUnlockMap } from '../lib'

export const useBuildingUnlockMap = () => {
  const corporations = useDataStore(dataSelectors.corporations)

  return useMemo(() => buildBuildingUnlockMap(corporations), [corporations])
}
