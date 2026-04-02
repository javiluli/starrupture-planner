import { useEffect, useMemo } from 'react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { isItemExportableToCorporation } from '@/features/planner/lib/corporations'
import { buildProductionPlan } from '@/features/planner/lib/production-plan'
import type { Stats } from '@/features/planner/types'

const EMPTY_STATS: Stats = { buildings: 0, power: 0, heat: 0 }

export const useProductionPlan = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const corporations = useDataStore(dataSelectors.corporations)
  const targetId = usePlannerStore(plannerSelectors.targetId)
  const targetIpm = usePlannerStore(plannerSelectors.targetIpm)
  const supplyCountByItem = usePlannerStore(plannerSelectors.supplyCountByItem)
  const setPlannerStats = usePlannerStore(plannerSelectors.setPlannerStats)

  const isExportable = useMemo(() => isItemExportableToCorporation(corporations, targetId), [corporations, targetId])

  const plan = useMemo(() => {
    if (!targetId) return null
    return buildProductionPlan({
      buildings,
      targetId,
      targetIpm,
      supplyCountByItem,
      isExportable,
    })
  }, [buildings, targetId, targetIpm, supplyCountByItem, isExportable])

  useEffect(() => {
    if (plan?.stats) {
      setPlannerStats(plan.stats)
      return
    }

    setPlannerStats(EMPTY_STATS)
  }, [plan, setPlannerStats])

  return plan
}
