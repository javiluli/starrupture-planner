import type { Edge } from '@xyflow/react'
import dagre from 'dagre'
import type { ItemType } from '@/shared/@types/production'

const EDGE_LABEL_STYLES = {
  labelBgBorderRadius: 10,
  labelBgPadding: [10, 6] as [number, number],
  labelBgStyle: { fill: '#0A101B', stroke: '#E6EDF3', strokeWidth: 1 },
  labelStyle: { fill: '#E6EDF3', fontSize: 16, fontWeight: 600 },
}

interface ConnectParams {
  edges: Edge[]
  dagreGraph: dagre.graphlib.Graph
  itemName: string
  itemId: string
  itemType: ItemType
  consumerId: string
  totalNeeded: number
  supplyCountInventory: Record<string, number>
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
  supplyCountInventory,
  isFinalLauncher = false,
}: ConnectParams) => {
  if (totalNeeded <= 0) return

  let remaining = totalNeeded

  const available = supplyCountInventory[itemId] || 0
  if (available > 0) {
    const taken = Math.min(available, remaining)
    supplyCountInventory[itemId] -= taken
    remaining -= taken

    edges.push({
      id: `react-flow__edge-supply-${itemId}-${consumerId}`,
      source: `supply-${itemId}`,
      target: consumerId,
      label: `${itemName} x${taken.toFixed(1)}/m`,
      animated: true,
      style: {
        stroke: '#6366f1',
        strokeWidth: 6,
        strokeDasharray: '5 5',
      },
      ...EDGE_LABEL_STYLES,
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
      ...EDGE_LABEL_STYLES,
      className: isFinalLauncher ? 'react-flow__edge-orbital_cargo_launcher' : `react-flow__edge-${itemType}`,
    })
    dagreGraph.setEdge(itemId, consumerId)
  }
}
