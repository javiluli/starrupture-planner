import { dataSelectors, useDataStore } from '@/store/data.store'
import { useMemo } from 'react'
import { corporationStats } from '../lib'

export const useCorporationsStats = () => {
  const corporations = useDataStore(dataSelectors.corporations)

  return useMemo(() => corporationStats({ corporations }), [corporations])
}
