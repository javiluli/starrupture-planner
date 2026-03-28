import { filterItems, type ItemFilterInput } from '@/features/items'
import type { ItemTableRow } from '@/features/items/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ItemsStoreState {
  filters: ItemFilterInput
  setSelectedCategory: (value: string) => void
  setSelectedBuildingId: (value: string) => void
  setSelectedCorporationId: (value: string) => void
  setSearchQuery: (value: string) => void
  getFilteredItems: (items: ItemTableRow[]) => ItemTableRow[]
  resetFilter: () => void
}

export const itemsSelectors = {
  filters: (state: ItemsStoreState) => state.filters,
  setSelectedCategory: (state: ItemsStoreState) => state.setSelectedCategory,
  setSelectedBuildingId: (state: ItemsStoreState) => state.setSelectedBuildingId,
  setSelectedCorporationId: (state: ItemsStoreState) => state.setSelectedCorporationId,
  setSearchQuery: (state: ItemsStoreState) => state.setSearchQuery,
  getFilteredItems: (state: ItemsStoreState) => state.getFilteredItems,
  resetFilter: (state: ItemsStoreState) => state.resetFilter,
}

export const useItemsStore = create<ItemsStoreState>()(
  persist(
    (set, get) => ({
      filters: {
        selectedCategory: '',
        selectedBuildingId: '',
        selectedCorporationId: '',
        searchQuery: '',
      },
      setSelectedCategory: (value) => set({ filters: { ...get().filters, selectedCategory: value } }),
      setSelectedBuildingId: (value) => set({ filters: { ...get().filters, selectedBuildingId: value } }),
      setSelectedCorporationId: (value) => set({ filters: { ...get().filters, selectedCorporationId: value } }),
      setSearchQuery: (value) => set({ filters: { ...get().filters, searchQuery: value } }),
      getFilteredItems: (items) => filterItems(items, get().filters),
      resetFilter: () => {
        set({
          filters: { selectedCategory: '', selectedBuildingId: '', selectedCorporationId: '', searchQuery: '' },
        })
      },
    }),
    {
      name: 'zstore.items',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
