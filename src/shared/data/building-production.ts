import type { Building } from '@/shared/@types/building.type'

/** Indexes every producer for an output item while preserving catalog order. */
export const indexProducerBuildingsByItemId = (buildings: readonly Building[]): ReadonlyMap<string, readonly Building[]> => {
  const producersByItemId = new Map<string, Building[]>()

  buildings.forEach((building) => {
    building.recipes?.forEach((recipe) => {
      const producers = producersByItemId.get(recipe.output.id) ?? []
      if (producers.some((producer) => producer.id === building.id)) return

      producers.push(building)
      producersByItemId.set(recipe.output.id, producers)
    })
  })

  return producersByItemId
}
