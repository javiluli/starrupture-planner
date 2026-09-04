import type { ProductionStep, PlanResolver } from './types'

/**
 * Construye pasos de produccion a partir de los totales de demanda.
 *
 * @param resolver Resolver del plan con variantes resueltas.
 * @param totals Mapa itemId -> ipm requerido.
 * @param supplyCountByItem Supply externo por item.
 * @returns Lista de pasos con receta, cargas y stats por item.
 */
export const buildSteps = (
  resolver: PlanResolver,
  totals: Map<string, number>,
  supplyCountByItem: Record<string, number>,
): ProductionStep[] => {
  const steps: ProductionStep[] = []

  totals.forEach((itemIpm, itemId) => {
    if (itemIpm <= 0) return

    const selectedBuilding = resolver.getBuildingForItem(itemId)
    const selectedRecipe = resolver.getRecipeForItem(itemId)
    if (!selectedBuilding || !selectedRecipe) return

    const recipeOutputIpm = selectedRecipe.output.amount_per_minute
    const buildingLoad = itemIpm / recipeOutputIpm

    steps.push({
      itemId,
      buildingId: selectedBuilding.id,
      buildingName: selectedBuilding.name,
      recipeOutputIpm: selectedRecipe.output.amount_per_minute,
      targetIpm: itemIpm,
      buildingLoad,
      buildingCount: Math.ceil(buildingLoad),
      buildingPower: selectedBuilding.power,
      buildingHeat: selectedBuilding.heat,
      supplyCount: supplyCountByItem[itemId] || 0,
      inputs: selectedRecipe.inputs,
    })
  })

  return steps
}
