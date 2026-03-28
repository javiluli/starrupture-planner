import { useMemo } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useItemMap } from '@/shared/hooks'

export const useCorporationsAccordionData = () => {
  const corporations = useDataStore(dataSelectors.corporations)
  const itemMap = useItemMap()

  const corporationsList = useMemo(() => Object.values(corporations), [corporations])

  return {
    corporationsList,
    itemMap,
  }
}
