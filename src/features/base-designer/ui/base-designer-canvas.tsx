import { Background, BackgroundVariant, Controls, ReactFlow, SelectionMode, type Edge, type Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { BASE_DESIGNER_FIT_VIEW, BASE_DESIGNER_FLOW_COLORS, BASE_DESIGNER_GRID_SIZE } from '../base-designer.config'
import { isBaseDesignerConnectionValid } from '../lib/connection-validation'
import { baseDesignerSelectors, useBaseDesignerStore } from '@/store/base-designer.store'
import { BuildingNode } from './nodes/building-node'
import { CoreNode } from './nodes/core-node'
import { BaseDesignerToolbar } from './toolbar/base-designer-toolbar'
import { useReducedMotion } from 'framer-motion'
import './base-designer.css'

const nodeTypes = {
  building: BuildingNode,
  core: CoreNode,
}

export const BaseDesignerCanvas = () => {
  const nodes = useBaseDesignerStore(baseDesignerSelectors.nodes)
  const edges = useBaseDesignerStore(baseDesignerSelectors.edges)
  const applyNodeChanges = useBaseDesignerStore(baseDesignerSelectors.applyNodeChanges)
  const applyEdgeChanges = useBaseDesignerStore(baseDesignerSelectors.applyEdgeChanges)
  const connectNodes = useBaseDesignerStore(baseDesignerSelectors.connectNodes)
  const reduceMotion = useReducedMotion() ?? false

  const isValidConnection = (connection: Connection | Edge) => isBaseDesignerConnectionValid({ connection, nodes, edges })

  return (
    <div
      data-testid="base-designer-canvas"
      data-base-designer-canvas
      data-flow-selection-surface
      className="h-full min-h-0 w-full overflow-hidden"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={applyNodeChanges}
        onEdgesChange={applyEdgeChanges}
        onConnect={connectNodes}
        isValidConnection={isValidConnection}
        selectionKeyCode="Shift"
        multiSelectionKeyCode={['Control', 'Meta']}
        selectionMode={SelectionMode.Partial}
        deleteKeyCode={null}
        snapToGrid
        snapGrid={[BASE_DESIGNER_GRID_SIZE, BASE_DESIGNER_GRID_SIZE]}
        fitView
        fitViewOptions={{ ...BASE_DESIGNER_FIT_VIEW, duration: reduceMotion ? 0 : BASE_DESIGNER_FIT_VIEW.duration }}
        colorMode="dark"
        attributionPosition="bottom-right"
        minZoom={0.5}
        maxZoom={3}
      >
        <Controls />
        <BaseDesignerToolbar />
        <Background
          bgColor={BASE_DESIGNER_FLOW_COLORS.canvas}
          color={BASE_DESIGNER_FLOW_COLORS.grid}
          variant={BackgroundVariant.Lines}
          gap={BASE_DESIGNER_GRID_SIZE}
          size={1}
        />
      </ReactFlow>
    </div>
  )
}
