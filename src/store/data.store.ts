import type { Building } from '@/shared/@types/building.type'
import type { CorporationsById } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { buildings, corporations, items } from '@/shared/data'
import { create } from 'zustand'

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

/** Read-only game catalog. JSON files remain the source of truth. */
export const useDataStore = create<DataStoreState>()(() => ({
  items: items as Item[],
  buildings: buildings as Building[],
  corporations,
}))
