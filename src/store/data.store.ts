import type { Building } from '@/shared/@types/building.type'
import type { CorporationsById } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { buildings, corporations, items } from '@/shared/data'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface DataStoreState {
  items: Item[]
  buildings: Building[]
  corporations: CorporationsById
}

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
