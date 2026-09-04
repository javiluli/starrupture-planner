import { useMemo } from 'react'
import { buildItemMap } from '@/lib'
import { dataSelectors, useDataStore } from '@/store/data.store'

export const useItemMap = () => {
  const items = useDataStore(dataSelectors.items)

  return useMemo(() => buildItemMap(items), [items])
}
