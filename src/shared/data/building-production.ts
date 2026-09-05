import type { Building } from '@/shared/@types/building.type'

const NON_PRODUCING_BUILDING_TYPES = new Set(['generator', 'transport', 'temperature', 'habitat', 'defense', 'storage', 'core'])

/** Regla compartida que identifica los buildings capaces de producir items. */
export const isProductionBuilding = (building: Building) => !NON_PRODUCING_BUILDING_TYPES.has(building.type)

/** Indexa todos los productores de cada output respetando el orden del catálogo. */
export const indexProducerBuildingsByItemId = (buildings: readonly Building[]): ReadonlyMap<string, readonly Building[]> => {
  const producersByItemId = new Map<string, Building[]>()

  buildings.forEach((building) => {
    building.recipes.forEach((recipe) => {
      const producers = producersByItemId.get(recipe.output.id) ?? []
      if (producers.some((producer) => producer.id === building.id)) return

      producers.push(building)
      producersByItemId.set(recipe.output.id, producers)
    })
  })

  return producersByItemId
}
