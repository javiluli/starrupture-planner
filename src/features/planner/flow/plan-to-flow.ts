import type { Edge, Node } from '@xyflow/react'
import { Position } from '@xyflow/react'
import dagre from 'dagre'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { DAGRE_GRAPH_CONFIG } from '@/features/planner/flow/config/dagre-config'
import { buildLauncherNode, buildProductionNodes, buildSupplyNodes } from '@/features/planner/flow/core/flow-nodes'
import { buildEdges } from '@/features/planner/flow/core/flow-edges'
import type { ProductionPlan } from '@/features/planner/lib/production-plan'

interface PlanToFlowParams {
  plan: ProductionPlan
  items: Item[]
  buildings: Building[]
  setSupplyCount: (id: string, val: number) => void
}

interface PlanToFlowResult {
  nodes: Node[]
  edges: Edge[]
}

export const planToFlow = ({ plan, items, buildings, setSupplyCount }: PlanToFlowParams): PlanToFlowResult => {
  if (!plan.targetId || plan.targetIpm <= 0) {
    return { nodes: [], edges: [] }
  }

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph(DAGRE_GRAPH_CONFIG)

  const supplyNodes = buildSupplyNodes(plan.supplyCountByItem, buildings, items, setSupplyCount, dagreGraph)
  const productionNodes = buildProductionNodes(plan.targetId, plan.steps, items, setSupplyCount, dagreGraph)
  const launcherNodes = plan.isExportable ? buildLauncherNode(plan.targetId, plan.targetIpm, items, buildings, dagreGraph) : []

  const nodes = [...supplyNodes, ...productionNodes, ...launcherNodes]
  const edges = buildEdges(
    plan.targetId,
    plan.targetIpm,
    plan.steps,
    { ...plan.supplyCountInventory },
    items,
    plan.isExportable,
    dagreGraph,
  )

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((n) => {
    const pos = dagreGraph.node(n.id)
    return {
      ...n,
      position: {
        x: pos.x - (n.width || 260) / 2,
        y: pos.y - (n.height || 390) / 2,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
  })

  return { nodes: layoutedNodes, edges }
}
