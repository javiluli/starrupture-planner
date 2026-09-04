import { buildProductionFlowFromPlan } from '@/features/planner/flow/builder/build-production-flow'
import { scheduleFlowFitView, shouldFitFlowView } from '@/features/planner/flow/layout/flow-fit'
import { useProduction } from '@/features/planner/hooks/use-production'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { useReactFlow } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import type { ProductionPlan } from '@/features/planner/lib/production-plan/types'

interface UseFlowDiagramParams {
  items: Item[]
  buildings: Building[]
  plan: ProductionPlan | null
}

export const useFlowDiagram = ({ items, buildings, plan }: UseFlowDiagramParams) => {
  const targetId = usePlannerStore(plannerSelectors.targetId)
  const setSupplyCount = usePlannerStore(plannerSelectors.setSupplyCount)

  const { nodes, setNodes, edges, setEdges, onNodesChange } = useProduction()
  const { fitView } = useReactFlow()

  const lastTargetIdRef = useRef(targetId)

  useEffect(() => {
    if (!plan) return

    const { nodes: newNodes, edges: newEdges } = buildProductionFlowFromPlan({
      plan,
      items,
      buildings,
      setSupplyCount,
    })

    setNodes(newNodes)
    setEdges(newEdges)

    if (shouldFitFlowView(lastTargetIdRef.current, targetId)) {
      lastTargetIdRef.current = targetId
      scheduleFlowFitView(fitView)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, items, buildings, targetId, fitView, setSupplyCount])

  return { nodes, edges, onNodesChange }
}
