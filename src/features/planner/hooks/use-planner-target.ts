import { useCallback } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { findRecipeForItem } from '@/features/planner/lib/recipes'
import { clampTargetIpm } from '@/features/planner/lib'

export const usePlannerTarget = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const currentTargetId = usePlannerStore(plannerSelectors.targetId)
  const setTargetId = usePlannerStore(plannerSelectors.setTargetId)
  const setTargetIpm = usePlannerStore(plannerSelectors.setTargetIpm)
  const resetBuildingVariants = usePlannerStore(plannerSelectors.resetBuildingVariants)

  const selectTargetItem = useCallback(
    (id: string) => {
      if (!id) {
        setTargetId('')
        setTargetIpm(0)
        resetBuildingVariants()
        return
      }

      if (id !== currentTargetId) {
        resetBuildingVariants()
      }

      const { recipe } = findRecipeForItem(buildings, id)
      const baseIpm = recipe ? recipe.output.amount_per_minute : 1

      setTargetId(id)
      setTargetIpm(clampTargetIpm(baseIpm))
    },
    [buildings, currentTargetId, resetBuildingVariants, setTargetId, setTargetIpm],
  )

  const setTargetRate = useCallback(
    (value: number) => {
      setTargetIpm(clampTargetIpm(value))
    },
    [setTargetIpm],
  )

  return {
    selectTargetItem,
    setTargetRate,
  }
}
