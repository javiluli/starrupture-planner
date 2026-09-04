import type { Building } from '@/shared/@types/building.type'
import { indexProducerBuildingsByItemId } from '@/shared/data/building-production'

/**
 * Busca en el catalogo que edificio y que receta corresponden a un item especifico.
 *
 * @param buildings Catalogo de edificios.
 * @param itemId Id del item a resolver.
 * @returns Objeto con building y recipe (si existen).
 */
export const findRecipeForItem = (buildings: Building[], itemId: string) => {
  const building = indexProducerBuildingsByItemId(buildings).get(itemId)?.[0]
  const recipe = building?.recipes?.find((r) => r.output.id === itemId)
  return { building, recipe }
}
