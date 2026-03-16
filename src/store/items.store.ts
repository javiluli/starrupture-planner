import { filterItems, type ItemFilterInput } from '@/features/items'
import type { ItemTableRow } from '@/store/data.store'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ItemsStoreState {
  filters: ItemFilterInput
  setSelectedCategory: (value: string) => void
  setSelectedBuildingId: (value: string) => void
  setSearchQuery: (value: string) => void
  getFilteredItems: (items: ItemTableRow[]) => ItemTableRow[]
}

export const itemsSelectors = {
  filters: (state: ItemsStoreState) => state.filters,
  setSelectedCategory: (state: ItemsStoreState) => state.setSelectedCategory,
  setSelectedBuildingId: (state: ItemsStoreState) => state.setSelectedBuildingId,
  setSearchQuery: (state: ItemsStoreState) => state.setSearchQuery,
  getFilteredItems: (state: ItemsStoreState) => state.getFilteredItems,
}

export const useItemsStore = create<ItemsStoreState>()(
  persist(
    (set, get) => ({
      filters: {
        selectedCategory: '',
        selectedBuildingId: '',
        searchQuery: '',
      },
      setSelectedCategory: (value) => set({ filters: { ...get().filters, selectedCategory: value } }),
      setSelectedBuildingId: (value) => set({ filters: { ...get().filters, selectedBuildingId: value } }),
      setSearchQuery: (value) => set({ filters: { ...get().filters, searchQuery: value } }),
      getFilteredItems: (items) => filterItems(items, get().filters),
    }),
    {
      name: 'zstore.items',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
