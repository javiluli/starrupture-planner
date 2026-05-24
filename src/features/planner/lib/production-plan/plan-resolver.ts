import type { Building } from '@/shared/@types/building.type'
import { findRecipeForItem } from '../recipes'
import { resolveBuildingVariant } from '../building-variants'
import type { PlanResolver } from './types'

/**
 * Crea un contexto para resolver building + receta efectiva por item.
 * Centraliza la logica de variantes para reutilizarla en todo el plan.
 */
export const buildPlanResolver = (
  buildings: Building[],
  buildingVariantByItemId: Record<string, string>,
): PlanResolver => {
  const getBuildingForItem = (itemId: string) => {
    const { building } = findRecipeForItem(buildings, itemId)
    if (!building) return null
    return resolveBuildingVariant(buildings, building, buildingVariantByItemId[itemId])
  }

  const getRecipeForItem = (itemId: string) => {
    const building = getBuildingForItem(itemId)
    if (!building) return null
    const recipe = building.recipes?.find((r) => r.output.id === itemId)
    return recipe ?? null
  }

  return {
    buildings,
    buildingVariantByItemId,
    getBuildingForItem,
    getRecipeForItem,
  }
}
