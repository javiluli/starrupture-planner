import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { buildProductionPlan } from '@/features/planner/lib/production-plan'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { ProductionPlanContext } from '../hooks/use-production-plan'

interface ProductionPlanProviderProps {
  children: ReactNode
}

/**
 * Calculates the production plan once and shares the derived result with every diagram.
 * Zustand remains responsible only for editable planner inputs.
 */
export const ProductionPlanProvider = ({ children }: ProductionPlanProviderProps) => {
  const items = useDataStore(dataSelectors.items)
  const buildings = useDataStore(dataSelectors.buildings)
  const targetId = usePlannerStore(plannerSelectors.targetId)
  const targetIpm = usePlannerStore(plannerSelectors.targetIpm)
  const supplyCountByItem = usePlannerStore(plannerSelectors.supplyCountByItem)
  const buildingVariantByItemId = usePlannerStore(plannerSelectors.buildingVariantByItemId)

  const plan = useMemo(() => {
    if (!targetId) return null

    const targetItem = items.find((item) => item.id === targetId)

    return buildProductionPlan({
      buildings,
      targetId,
      targetIpm,
      supplyCountByItem,
      buildingVariantByItemId,
      isExportable: Boolean(targetItem?.corporations?.length),
    })
  }, [items, buildings, targetId, targetIpm, supplyCountByItem, buildingVariantByItemId])

  return <ProductionPlanContext value={plan}>{children}</ProductionPlanContext>
}
