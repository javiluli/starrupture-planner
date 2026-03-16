import { Background, BackgroundVariant, Controls, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { FLOW_BACKGROUND } from '@/features/planner/flow/config/flow-theme'
import { FLOW_NODE_TYPES } from '@/features/planner/flow/config/node-types'
import { useFlowDiagram } from '@/features/planner/hooks/use-flow-diagram'

function ProductionFlowDiagramInner() {
  const itemsStore = useDataStore(dataSelectors.items)
  const buildingsStore = useDataStore(dataSelectors.buildings)

  const { nodes, edges, onNodesChange } = useFlowDiagram({ items: itemsStore, buildings: buildingsStore })

  return (
    <ReactFlow
      minZoom={0.15}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={FLOW_NODE_TYPES}
      colorMode="dark"
      fitView
    >
      <Background bgColor={FLOW_BACKGROUND.bg} color={FLOW_BACKGROUND.grid} variant={BackgroundVariant.Lines} gap={60} />
      <Controls position="bottom-right" />
    </ReactFlow>
  )
}

export function ProductionFlowDiagram() {
  return (
    <ReactFlowProvider>
      <ProductionFlowDiagramInner />
    </ReactFlowProvider>
  )
}
