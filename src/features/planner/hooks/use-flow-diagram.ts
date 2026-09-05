import { planToFlow } from '@/features/planner/flow/plan-to-flow'
import { scheduleFlowFitView, shouldFitFlowView } from '@/features/planner/flow/layout/flow-fit'
import type { PlannerFlowNode } from '@/features/planner/flow/types'
import { useProduction } from '@/features/planner/hooks/use-production'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { useReactFlow } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import type { ProductionPlan } from '@/features/planner/lib/production-plan/types'

interface UseFlowDiagramParams {
  items: readonly Item[]
  buildings: readonly Building[]
  plan: ProductionPlan | null
}

export const useFlowDiagram = ({ items, buildings, plan }: UseFlowDiagramParams) => {
  const targetId = plan?.targetId ?? ''

  const { nodes, setNodes, edges, setEdges, onNodesChange } = useProduction()
  const { fitView } = useReactFlow<PlannerFlowNode>()

  const lastTargetIdRef = useRef(targetId)

  useEffect(() => {
    if (!plan) return

    const { nodes: newNodes, edges: newEdges } = planToFlow({
      plan,
      items,
      buildings,
    })

    setNodes(newNodes)
    setEdges(newEdges)

    if (shouldFitFlowView(lastTargetIdRef.current, targetId)) {
      lastTargetIdRef.current = targetId
      return scheduleFlowFitView(fitView)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, items, buildings, targetId, fitView])

  return { nodes, edges, onNodesChange }
}
