import { buildItemsTableRows } from '@/features/items/lib/build-items-table-rows'
import { items, producerBuildingsByItemId } from '@/shared/data'

const itemTableRows = buildItemsTableRows(items, producerBuildingsByItemId)

export const useItemsTableRows = () => itemTableRows
