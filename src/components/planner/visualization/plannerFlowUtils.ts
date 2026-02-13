import dagre from 'dagre'
import { type Node, type Edge, Position } from '@xyflow/react'

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  // LR = Left to Right (de izquierda a derecha)
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 200, nodesep: 150 })

  nodes.forEach((node) => {
    // Definimos el tamaño aproximado de tus ProductionNodes
    dagreGraph.setNode(node.id, { width: 250, height: 300 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: nodeWithPosition.x - 125,
        y: nodeWithPosition.y - 150,
      },
    }
  })
}
