import { applyNodeChanges, type Edge, type Node, type OnNodesChange } from '@xyflow/react'
import { useCallback, useState } from 'react'

export const useProduction = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const onNodesChange: OnNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), [])

  return { nodes, setNodes, edges, setEdges, onNodesChange }
}
