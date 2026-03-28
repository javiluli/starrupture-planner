import type { CorporationLevelMatch } from '@/shared/@types/production'

export type ItemFilterInput = {
  selectedCategory: string
  selectedBuildingId: string
  selectedCorporationId: string
  searchQuery: string
}

type ItemFilterTarget = {
  name: string
  type: string
  buildingId: string | null
  corporations: CorporationLevelMatch[] | undefined
}

export const filterItems = <T extends ItemFilterTarget>(items: T[], filters: ItemFilterInput): T[] => {
  const { selectedCategory, selectedBuildingId, selectedCorporationId, searchQuery } = filters
  const normalizedQuery = searchQuery.toLowerCase()

  return items
    .filter((item) => (selectedCategory ? item.type === selectedCategory : true))
    .filter((item) => (selectedBuildingId ? item.buildingId === selectedBuildingId : true))
    .filter((item) => (selectedCorporationId ? item.corporations?.some((c) => c.corporationId === selectedCorporationId) : true))
    .filter((item) => (normalizedQuery ? item.name.toLowerCase().includes(normalizedQuery) : true))
}
