import type { Building } from '@/shared/@types/building.type'
import type { CorporationLevelRef, CorporationsById } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import type { ItemTableRow } from '@/features/items/types'

const getBuildingForItem = (buildings: Building[], itemId: string) =>
  buildings.find((building) => building.recipes?.some((recipe) => recipe.output.id === itemId))

const getCorporationsForItem = (corporations: CorporationsById, itemId: string): CorporationLevelRef[] =>
  Object.values(corporations).flatMap((corp) =>
    corp.levels
      .filter((level) => level.components.some((component) => component.id === itemId))
      .map((level) => ({
        corporationId: corp.id,
        level: level.level,
      })),
  )

export const buildItemsTableData = (items: Item[], buildings: Building[], corporations: CorporationsById): ItemTableRow[] =>
  items.map((item) => {
    const building = getBuildingForItem(buildings, item.id)
    const itemCorporations = getCorporationsForItem(corporations, item.id)

    return {
      ...item,
      buildingId: building?.id ?? null,
      production: building?.name,
      corporations: itemCorporations,
    }
  })
