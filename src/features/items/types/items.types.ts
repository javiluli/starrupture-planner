import type { CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'

export type ItemFilterInput = {
  selectedCategory: string
  selectedBuildingId: string
  selectedCorporationId: string
  searchQuery: string
}

export type ItemTableRow = Item & {
  buildingId: string | null
  production: string | undefined
  corporations: CorporationLevelRef[] | undefined
}
