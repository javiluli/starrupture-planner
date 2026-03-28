import type { Building, CorporationLevelMatch, CorporationsData, Item } from '@/shared/@types/production'
import { buildings, corporations, items } from '@/shared/data'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface DataStoreState {
  items: Item[]
  buildings: Building[]
  corporations: CorporationsData
}

export type ItemTableRow = Item & {
  buildingId: string | null
  production: string | undefined
  corporations: CorporationLevelMatch[] | undefined
}

const getBuildingForItem = (buildings: Building[], itemId: string) => buildings.find((b) => b.recipes?.some((r) => r.output.id === itemId))

const getCorporationsForItem = (corporations: CorporationsData, itemId: string) =>
  Object.values(corporations).flatMap((corp) =>
    corp.levels
      .filter((level) => level.components.some((comp) => comp.id === itemId))
      .map((level) => ({
        corporationId: corp.id,
        level: level.level,
      })),
  )

export const buildItemsTableData = (items: Item[], buildings: Building[], corporations: CorporationsData): ItemTableRow[] =>
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

export const dataSelectors = {
  items: (state: DataStoreState) => state.items,
  buildings: (state: DataStoreState) => state.buildings,
  corporations: (state: DataStoreState) => state.corporations,
}

/**
 *
 * @module useDataStore
 */
export const useDataStore = create<DataStoreState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set) => ({
      items: items as Item[],
      buildings: buildings as Building[],
      corporations,
    }),
    {
      name: 'zstore.data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
