import { useMemo } from 'react'
import { buildItemsTableRows } from '@/features/items/lib/build-items-table-rows'
import { dataSelectors, useDataStore } from '@/store/data.store'

export const useItemsTableRows = () => {
  const items = useDataStore(dataSelectors.items)
  const buildings = useDataStore(dataSelectors.buildings)

  return useMemo(() => buildItemsTableRows(items, buildings), [items, buildings])
}
