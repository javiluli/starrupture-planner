import type { Building, Item } from '@/types/production'
import { type Edge } from '@xyflow/react'
import dagre from 'dagre'

/**
 * DEFINICION DE CONEXIONES LOGISTICAS
 * * Mapea el flujo de materiales discriminando origen por color y estilo:
 * - Verde/Punteado: Flujo desde inventario externo.
 * - Color Solido: Flujo generado por produccion local.
 * - Naranja: Flujo hacia sistema de exportacion final.
 */
export const buildEdges = (
  targetId: string,
  targetIpm: number,
  totals: Map<string, number>,
  supplies: Record<string, number>,
  buildings: Building[],
  items: Item[],
  addOrgitalExportSystem: boolean,
  getItemColor: (id: string) => string,
  dagreGraph: dagre.graphlib.Graph,
): Edge[] => {
  const edges: Edge[] = []

  const currentSupplyInventory: Record<string, number> = {}
  Object.keys(supplies).forEach((id) => {
    currentSupplyInventory[id] = Math.max(1, supplies[id])
  })

  const commonLabelStyle = { fill: '#fff', fontSize: 16, fontWeight: 700 }

  const connectToSources = (consumerId: string, itemId: string, totalNeeded: number, isFinalLauncher = false) => {
    if (totalNeeded <= 0) return
    const itemInfo = items.find((i) => i.id === itemId)
    let remaining = totalNeeded

    // SEGMENTO DE SUMINISTRO (SUPPLY)
    const available = currentSupplyInventory[itemId] || 0
    if (available > 0) {
      const taken = Math.min(available, remaining)
      currentSupplyInventory[itemId] -= taken
      remaining -= taken

      edges.push({
        id: `e-supply-${itemId}-${consumerId}`,
        source: `supply-${itemId}`,
        target: consumerId,
        label: `${itemInfo?.name} x${taken.toFixed(1)}/m`,
        animated: true,
        style: {
          stroke: isFinalLauncher ? '#f97316' : '#22c55e',
          strokeWidth: isFinalLauncher ? 4 : 3,
          strokeDasharray: isFinalLauncher ? '' : '5, 5',
        },
        labelStyle: commonLabelStyle,
      })
      dagreGraph.setEdge(`supply-${itemId}`, consumerId)
    }

    // SEGMENTO DE PRODUCCION INTERNA
    if (remaining > 0) {
      edges.push({
        id: `e-${itemId}-${consumerId}`,
        source: itemId,
        target: consumerId,
        label: `${itemInfo?.name} x${remaining.toFixed(1)}/m`,
        style: {
          stroke: isFinalLauncher ? '#f97316' : getItemColor(itemId),
          strokeWidth: isFinalLauncher ? 4 : 3,
          opacity: 0.8,
        },
        labelStyle: commonLabelStyle,
      })
      dagreGraph.setEdge(itemId, consumerId)
    }
  }

  // Iteracion sobre el mapa de totales para conectar insumos de fabricacion
  totals.forEach((prodQty, nodeId) => {
    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === nodeId))
    const r = b?.recipes?.find((r) => r.output.id === nodeId)
    r?.inputs?.forEach((input) => {
      const inputNeeded = (input.amount_per_minute / r.output.amount_per_minute) * prodQty
      connectToSources(nodeId, input.id, inputNeeded)
    })
  })

  // Conexion de salida hacia el Launcher Orbital
  if (addOrgitalExportSystem) {
    connectToSources('terminal-launcher', targetId, targetIpm, true)
  }

  return edges
}
