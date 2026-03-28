import { useMemo } from 'react'
import type { Corporation } from '@/shared/@types/corporations.type'
import { dataSelectors, useDataStore } from '@/store/data.store'

export const useCorporationsList = (): Corporation[] => {
  const corporations = useDataStore(dataSelectors.corporations)

  return useMemo(() => Object.values(corporations), [corporations])
}
