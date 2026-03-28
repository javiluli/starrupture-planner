import type { Building } from '@/shared/@types/building.type'
import { findRecipeForItem } from '../recipes'
import type { ProductionStep } from './types'

/**
 * Construye pasos de produccion a partir de los totales de demanda.
 *
 * @param buildings Catalogo de edificios.
 * @param totals Mapa itemId -> ipm requerido.
 * @param supplyCountByItem Supply externo por item.
 * @returns Lista de pasos con receta, cargas y stats por item.
 */
export const buildSteps = (
  buildings: Building[],
  totals: Map<string, number>,
  supplyCountByItem: Record<string, number>,
): ProductionStep[] => {
  const steps: ProductionStep[] = []

  totals.forEach((itemIpm, itemId) => {
    if (itemIpm <= 0) return

    const { building, recipe } = findRecipeForItem(buildings, itemId)
    if (!building || !recipe) return

    const recipeOutputIpm = recipe.output.amount_per_minute
    const buildingLoad = itemIpm / recipeOutputIpm

    steps.push({
      itemId,
      buildingId: building.id,
      buildingName: building.name,
      recipeOutputIpm,
      targetIpm: itemIpm,
      buildingLoad,
      buildingCount: Math.ceil(buildingLoad),
      buildingPower: building.power,
      buildingHeat: building.heat,
      supplyCount: supplyCountByItem[itemId] || 0,
      inputs: recipe.inputs,
    })
  })

  return steps
}
