import type { Edge } from '@xyflow/react'
import dagre from 'dagre'
import type { ItemType } from '@/shared/@types/production'

interface ConnectParams {
  edges: Edge[]
  dagreGraph: dagre.graphlib.Graph
  itemName: string
  itemId: string
  itemType: ItemType
  consumerId: string
  totalNeeded: number
  supplyInventory: Record<string, number>
  isFinalLauncher?: boolean
}

/**
 * Conecta supply y produccion en un mismo flujo.
 *
 * Regla: primero consume supply y luego conecta produccion.
 *
 * @param params Datos necesarios para crear edges y actualizar inventario.
 */
export const connectSupplyAndProduction = ({
  edges,
  dagreGraph,
  itemName,
  itemId,
  itemType,
  consumerId,
  totalNeeded,
  supplyInventory,
  isFinalLauncher = false,
}: ConnectParams) => {
  if (totalNeeded <= 0) return

  let remaining = totalNeeded

  const available = supplyInventory[itemId] || 0
  if (available > 0) {
    const taken = Math.min(available, remaining)
    supplyInventory[itemId] -= taken
    remaining -= taken

    edges.push({
      id: `react-flow__edge-supply-${itemId}-${consumerId}`,
      source: `supply-${itemId}`,
      target: consumerId,
      label: `${itemName} x${taken.toFixed(1)}/m`,
      animated: true,
      style: {
        stroke: isFinalLauncher ? '#00ff9f' : '#3b82f6',
        strokeWidth: 4,
        strokeDasharray: isFinalLauncher ? '' : '5, 5',
      },
      labelStyle: { fill: '#fff', fontSize: 18, fontWeight: 700 },
      className: `e-supply-${itemType}`,
    })
    dagreGraph.setEdge(`supply-${itemId}`, consumerId)
  }

  if (remaining > 0) {
    edges.push({
      id: `e-${itemId}-${consumerId}`,
      source: itemId,
      target: consumerId,
      label: `${itemName} x${remaining.toFixed(1)}/m`,
      style: {
        strokeWidth: 4,
        opacity: 0.8,
      },
      labelStyle: { fill: '#fff', fontSize: 18, fontWeight: 700 },
      className: isFinalLauncher ? 'react-flow__edge-orbital_cargo_launcher' : `react-flow__edge-${itemType}`,
    })
    dagreGraph.setEdge(itemId, consumerId)
  }
}
