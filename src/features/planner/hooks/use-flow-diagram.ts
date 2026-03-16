import { useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useProduction } from '@/features/planner/hooks/use-production'
import { shouldFitFlowView, scheduleFlowFitView } from '@/features/planner/flow/layout/flow-fit'
import type { Building, Item } from '@/shared/@types/production'
import { buildProductionFlow } from '@/features/planner/flow'
import { isItemExportableToCorporation } from '@/features/planner/lib/corporations'
import { useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'

interface UseFlowDiagramParams {
  items: Item[]
  buildings: Building[]
}

export const useFlowDiagram = ({ items, buildings }: UseFlowDiagramParams) => {
  const targetId = usePlannerStore(plannerSelectors.targetId)
  const targetIpm = usePlannerStore(plannerSelectors.targetIpm)
  const supplies = usePlannerStore(plannerSelectors.supplies)
  const setPlannerStats = usePlannerStore(plannerSelectors.setPlannerStats)
  const setSupplyAmount = usePlannerStore(plannerSelectors.setSupplyAmount)

  const corporations = useDataStore((state) => state.corporations)

  const { nodes, setNodes, edges, setEdges, onNodesChange } = useProduction()
  const { fitView } = useReactFlow()

  const lastTargetIdRef = useRef(targetId)

  useEffect(() => {
    const isExportable = isItemExportableToCorporation(corporations, targetId)
    const {
      nodes: newNodes,
      edges: newEdges,
      stats,
    } = buildProductionFlow({
      items,
      buildings,
      targetId,
      targetIpm,
      supplies,
      isExportable,
      updateSupply: setSupplyAmount,
    })

    setNodes(newNodes)
    setEdges(newEdges)
    setPlannerStats(stats)

    if (shouldFitFlowView(lastTargetIdRef.current, targetId)) {
      lastTargetIdRef.current = targetId
      scheduleFlowFitView(fitView)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, buildings, targetId, targetIpm, supplies, fitView, corporations, setSupplyAmount])

  return { nodes, edges, onNodesChange }
}

