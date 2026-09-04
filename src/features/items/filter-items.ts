import type { CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { ItemFilterInput } from '@/features/items/types'

type ItemFilterTarget = {
  name: string
  type: string
  producerBuildingIds: string[]
  corporations?: CorporationLevelRef[]
}

export const filterItems = <T extends ItemFilterTarget>(items: T[], filters: ItemFilterInput): T[] => {
  const { selectedCategory, selectedBuildingId, selectedCorporationId, searchQuery } = filters
  const normalizedQuery = searchQuery.toLowerCase()

  return items
    .filter((item) => (selectedCategory ? item.type === selectedCategory : true))
    .filter((item) => (selectedBuildingId ? item.producerBuildingIds.includes(selectedBuildingId) : true))
    .filter((item) => (selectedCorporationId ? item.corporations?.some((c) => c.corporationId === selectedCorporationId) : true))
    .filter((item) => (normalizedQuery ? item.name.toLowerCase().includes(normalizedQuery) : true))
}
