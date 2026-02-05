import BUILDINGS_DATA from '@/data/buildings_and_recipes.json'
import CORPORATIONS_DATA from '@/data/corporations_components.json'
import ITEMS_DATA from '@/data/items_catalog.json'
import type { Building, CorporationsData, Item } from '@/types/production'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface DataStoreState {
  items: Item[]
  buildings: Building[]
  corporations: CorporationsData
}

/**
 *
 * @module useDataStore
 */
export const useDataStore = create<DataStoreState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set) => ({
      items: ITEMS_DATA as Item[],
      buildings: BUILDINGS_DATA as Building[],
      corporations: CORPORATIONS_DATA as CorporationsData,
    }),
    {
      name: 'zstore.data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
