import { useSketchStore } from '@/store/sketch.store'
import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import { useCallback, useMemo } from 'react'
import { calculateStatsSketchTotals } from '../core/calculateStatsSketchTotals'
import { BuildingNode, CoreBaseNode } from './reactflow-nodes'

const nodeTypes = {
  coreBaseNode: CoreBaseNode,
  buildingNode: BuildingNode,
}

const initialNodes: Node[] = [
  {
    id: 'campo-1',
    type: 'group',
    data: {},
    position: { x: 10, y: 10 },
    className: 'field-grid',
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.035)',
      height: 1020,
      width: 1020,
      boxSizing: 'border-box',
      border: '1px solid rgba(255, 255, 255, 0.7)',
      borderRadius: 0,
    },
  },
  // nodo central
  {
    id: 'nodo-estatico',
    type: 'coreBaseNode',
    data: {},
    parentId: 'campo-1',
    extent: 'parent',
    draggable: false,
    selectable: false,
    connectable: false,
    deletable: false,
    position: { x: 1020 / 2 - 20, y: 1020 / 2 - 20 },
    style: {
      width: 40,
      height: 40,
      cursor: 'default',
    },
  },
]

const SketchDiagram = () => {
  const setPlannerStats = useSketchStore((state) => state.setPlannerStats)
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useMemo(() => {
    const { heat, maxPower, restPower } = calculateStatsSketchTotals(nodes)

    setPlannerStats(heat, maxPower, restPower)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'bezier',
        animated: true,
        style: { stroke: '#3498db', strokeWidth: 2 },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      snapGrid={[10, 10]}
      fitView
      colorMode="dark"
      attributionPosition="bottom-right"
    >
      <Controls />
      <Background color="rgba(255, 255, 255, 0)" gap={10} size={1} />
    </ReactFlow>
  )
}

export default SketchDiagram
