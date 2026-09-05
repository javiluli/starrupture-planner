import { buildProductionNodeData } from '@/features/planner/flow/core/production-node-data'
import type { ProductionNodeData } from '@/features/planner/flow/types'
import { buildProductionPlan } from '@/features/planner/lib/production-plan'
import { buildings, itemById, items, producerBuildingsByItemId } from '@/shared/data'

export interface RecipeLoadingPreview {
  inputs: readonly ProductionNodeData[]
  target: ProductionNodeData
}

/** Builds a small preview from the same catalog and planner calculation used by the real graph. */
export function buildRecipeLoadingPreview(targetId: string): RecipeLoadingPreview | null {
  const targetItem = itemById.get(targetId)
  const targetBuilding = producerBuildingsByItemId.get(targetId)?.[0]
  const targetRecipe = targetBuilding?.recipes.find((recipe) => recipe.output.id === targetId)
  if (!targetItem || !targetRecipe) return null

  const plan = buildProductionPlan({
    buildings,
    producerBuildingsByItemId,
    targetId,
    targetIpm: targetRecipe.output.amount_per_minute,
    isRawTarget: targetItem.type === 'raw',
    supplyCountByItem: {},
    buildingVariantByItemId: {},
    isExportable: false,
  })
  const stepByItemId = new Map(plan.steps.map((step) => [step.itemId, step]))
  const targetStep = stepByItemId.get(targetId)
  if (!targetStep) return null

  return {
    inputs: targetStep.inputs.flatMap((input) => {
      const step = stepByItemId.get(input.id)
      return step ? [buildProductionNodeData(step, items)] : []
    }),
    target: buildProductionNodeData(targetStep, items),
  }
}
