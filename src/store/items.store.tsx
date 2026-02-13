import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useDataStore } from './data.store'
import type { Building, CorporationLevelMatch, Item } from '@/types/production'

interface ItemsStoreState {
  getBuildingToItemId: (itemId: string) => Building | undefined
  getCorporationNameToItemId: (itemId: string) => CorporationLevelMatch[]
  getItemsTableData: () => (Item & {
    buildingId: string | null
    production: string | undefined
    corporations: CorporationLevelMatch[] | undefined
  })[]
}

/**
 *
 * @module useItemStore
 */
export const useItemStore = create<ItemsStoreState>()(
  persist(
    (_set, get) => ({
      getBuildingToItemId: (itemId) => {
        const buildings = useDataStore.getState().buildings
        return buildings.find((b) => b.recipes?.some((r) => r.output.id === itemId))
      },

      getCorporationNameToItemId: (itemId) => {
        const corporations = useDataStore.getState().corporations
        return Object.values(corporations).flatMap((corp) =>
          corp.levels
            .filter((level) => level.components.some((comp) => comp.id === itemId))
            .map((level) => ({
              corporationId: corp.id,
              level: level.level,
            })),
        )
      },

      getItemsTableData: () => {
        const items = useDataStore.getState().items

        const result = items.map((item) => {
          const building = get().getBuildingToItemId(item.id)
          const corporations = get().getCorporationNameToItemId(item.id)

          return {
            ...item,
            buildingId: building?.id ?? null,
            production: building?.name,
            corporations,
          }
        })

        return result
      },
    }),
    {
      name: 'zstore.items',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
