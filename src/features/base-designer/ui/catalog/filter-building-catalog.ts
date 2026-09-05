import type { Building } from '@/shared/@types/building.type'

export interface BuildingCatalogFilters {
  category: string
  query: string
}

export interface BuildingCatalogCategory {
  id: string
  label: string
  count: number
}

const CATEGORY_LABELS: Record<string, string> = {
  defense: 'Defense',
  generator: 'Power',
  habitat: 'Habitats',
  production: 'Production',
  storage: 'Storage',
  temperature: 'Temperature',
  transport: 'Transport',
}

const normalizeSearchText = (value: string) => value.trim().toLocaleLowerCase()

export const getBuildingCategoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category.replaceAll('_', ' ')

/** Construye las categorias del catalogo manteniendo el orden de los datos del juego. */
export const getBuildingCatalogCategories = (buildings: readonly Building[]): BuildingCatalogCategory[] => {
  const counts = new Map<string, number>()
  for (const building of buildings) {
    counts.set(building.type, (counts.get(building.type) ?? 0) + 1)
  }

  return [...counts].map(([id, count]) => ({ id, count, label: getBuildingCategoryLabel(id) }))
}

/** Filtra el catalogo sin reordenar los buildings ni modificar el array original. */
export const filterBuildingCatalog = (buildings: readonly Building[], filters: BuildingCatalogFilters): Building[] => {
  const query = normalizeSearchText(filters.query)

  return buildings.filter((building) => {
    if (filters.category && building.type !== filters.category) return false
    if (!query) return true

    const searchableText = `${building.name} ${building.id} ${getBuildingCategoryLabel(building.type)}`.toLocaleLowerCase()
    return searchableText.includes(query)
  })
}
