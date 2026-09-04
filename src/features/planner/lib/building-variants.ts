import type { Building } from '@/shared/@types/building.type'

const NON_PRODUCING_TYPES = new Set(['generator', 'transport', 'temperature', 'habitat', 'defense', 'storage', 'core'])

/**
 * Indica si el building se usa para producir items.
 */
export const isProductionBuilding = (building: Building) => !NON_PRODUCING_TYPES.has(building.type)

export interface BuildingVariantOptions {
  baseId: string
  options: Building[]
}

const getRecipeForItem = (building: Building, itemId: string) =>
  building.recipes?.find((recipe) => recipe.output.id === itemId)

const normalizeInputs = (inputs: Building['recipes'][number]['inputs']) =>
  [...inputs].sort((a, b) => (a.id === b.id ? a.amount_per_minute - b.amount_per_minute : a.id.localeCompare(b.id)))

const hasMeaningfulDifference = (base: Building, upgrade: Building, itemId: string) => {
  const baseRecipe = getRecipeForItem(base, itemId)
  const upgradeRecipe = getRecipeForItem(upgrade, itemId)

  if (!baseRecipe || !upgradeRecipe) return false

  const outputDiff = baseRecipe.output.amount_per_minute !== upgradeRecipe.output.amount_per_minute
  const powerDiff = (base.power ?? 0) !== (upgrade.power ?? 0)
  const heatDiff = (base.heat ?? 0) !== (upgrade.heat ?? 0)

  const baseInputs = normalizeInputs(baseRecipe.inputs)
  const upgradeInputs = normalizeInputs(upgradeRecipe.inputs)
  const inputsDiff =
    baseInputs.length !== upgradeInputs.length ||
    baseInputs.some((input, idx) => input.id !== upgradeInputs[idx].id || input.amount_per_minute !== upgradeInputs[idx].amount_per_minute)

  return outputDiff || inputsDiff || powerDiff || heatDiff
}

/**
 * Devuelve las variantes disponibles para un building concreto.
 * Usa el campo `upgrade` como fuente principal.
 */
export const getBuildingVariantOptions = (
  buildings: Building[],
  buildingId: string,
  itemId: string,
): BuildingVariantOptions | null => {
  const byId = new Map(buildings.map((b) => [b.id, b]))
  const base = byId.get(buildingId)

  if (!base) return null

  // Si es un building de upgrade, busca su base
  const baseFromUpgrade = buildings.find((b) => b.upgrade === buildingId)
  const baseBuilding = baseFromUpgrade ?? base

  if (!isProductionBuilding(baseBuilding)) return null

  const upgradeId = baseBuilding.upgrade
  const upgradeBuilding = upgradeId ? byId.get(upgradeId) : undefined

  if (!upgradeBuilding) return null
  if (!hasMeaningfulDifference(baseBuilding, upgradeBuilding, itemId)) {
    // Si no hay diferencia real para la receta, no mostramos selector.
    return null
  }

  return {
    baseId: baseBuilding.id,
    options: [baseBuilding, upgradeBuilding],
  }
}

/**
 * Devuelve el building seleccionado para un paso concreto.
 * Si no hay seleccion, devuelve el building base.
 */
export const resolveBuildingVariant = (
  buildings: Building[],
  baseBuilding: Building,
  selectedVariantId?: string,
) => {
  if (!selectedVariantId) return baseBuilding
  return buildings.find((b) => b.id === selectedVariantId) ?? baseBuilding
}
