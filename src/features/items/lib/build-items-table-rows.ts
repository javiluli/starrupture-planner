import type { ItemTableRow } from '@/features/items/types'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'

const indexBuildingsByOutput = (buildings: Building[]) => {
  const buildingByItemId = new Map<string, Building>()

  for (const building of buildings) {
    for (const recipe of building.recipes ?? []) {
      if (!buildingByItemId.has(recipe.output.id)) buildingByItemId.set(recipe.output.id, building)
    }
  }

  return buildingByItemId
}

/** Builds the read-only rows consumed by the Items table. */
export const buildItemsTableRows = (items: Item[], buildings: Building[]): ItemTableRow[] => {
  const buildingByItemId = indexBuildingsByOutput(buildings)

  return items
    .map((item) => {
      const building = buildingByItemId.get(item.id)

      return {
        ...item,
        buildingId: building?.id ?? null,
        production: building?.name,
      }
    })
    .sort((firstItem, secondItem) => firstItem.name.localeCompare(secondItem.name))
}
