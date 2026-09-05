import { Background, BackgroundVariant, Controls, ReactFlow, ReactFlowProvider } from '@xyflow/react'

import { buildings, items } from '@/shared/data'
import { FLOW_COLORS } from '@/features/planner/flow/config/flow-theme'
import { FLOW_NODE_TYPES } from '@/features/planner/flow/config/node-types'
import { useFlowDiagram } from '@/features/planner/hooks/use-flow-diagram'
import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'

function ProductionFlowDiagramInner() {
  const plan = useProductionPlan()

  const { nodes, edges, onNodesChange } = useFlowDiagram({
    items,
    buildings,
    plan,
  })

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-hidden">
      <ReactFlow
        minZoom={0.15}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={FLOW_NODE_TYPES}
        colorMode="dark"
        fitView
      >
        <Background bgColor={FLOW_COLORS.canvas} color={FLOW_COLORS.grid} variant={BackgroundVariant.Lines} gap={60} />

        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  )
}

export function ProductionFlowDiagram() {
  return (
    <ReactFlowProvider>
      <ProductionFlowDiagramInner />
    </ReactFlowProvider>
  )
}
