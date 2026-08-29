import { useMemo } from 'react'
import { buildItemsTableData } from '@/features/items/lib/build-items-table-data'
import { dataSelectors, useDataStore } from '@/store/data.store'

export const useItemsTableData = () => {
  const items = useDataStore(dataSelectors.items)
  const buildings = useDataStore(dataSelectors.buildings)
  const corporations = useDataStore(dataSelectors.corporations)

  return useMemo(
    () => buildItemsTableData(items, buildings, corporations),
    [items, buildings, corporations],
  )
}
