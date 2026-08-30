import { dataSelectors, useDataStore } from '@/store/data.store'
import { useMemo } from 'react'
import { getCorporationsSummary } from '../lib/corporation-summary'

export const useCorporationsSummary = () => {
  const corporations = useDataStore(dataSelectors.corporations)

  return useMemo(() => getCorporationsSummary(corporations), [corporations])
}
