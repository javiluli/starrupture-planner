export type ItemFilterInput = {
  selectedCategory: string
  selectedBuildingId: string
  searchQuery: string
}

type ItemFilterTarget = {
  type: string
  buildingId: string | null
  name: string
}

export const filterItems = <T extends ItemFilterTarget>(items: T[], filters: ItemFilterInput): T[] => {
  const { selectedCategory, selectedBuildingId, searchQuery } = filters
  const normalizedQuery = searchQuery.toLowerCase()

  return items
    .filter((item) => (selectedCategory ? item.type === selectedCategory : true))
    .filter((item) => (selectedBuildingId ? item.buildingId === selectedBuildingId : true))
    .filter((item) => (normalizedQuery ? item.name.toLowerCase().includes(normalizedQuery) : true))
}