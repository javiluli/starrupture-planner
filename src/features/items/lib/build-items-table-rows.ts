import type { ItemTableRow } from '@/features/items/types'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { indexProducerBuildingsByItemId } from '@/shared/data/building-production'

/** Builds the read-only rows consumed by the Items table. */
export const buildItemsTableRows = (items: Item[], buildings: Building[]): ItemTableRow[] => {
  const producersByItemId = indexProducerBuildingsByItemId(buildings)

  return items
    .map((item) => {
      const producers = producersByItemId.get(item.id) ?? []

      return {
        ...item,
        producerBuildingIds: producers.map((producer) => producer.id),
        primaryProducerName: producers[0]?.name,
      }
    })
    .sort((firstItem, secondItem) => firstItem.name.localeCompare(secondItem.name))
}
