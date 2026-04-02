import { ORBITAL_CARGO_LAUNCHER_ID } from '@/features/planner/constants'
import type { Item } from '@/shared/@types/item.type'
import { type Edge } from '@xyflow/react'
import dagre from 'dagre'
import { getItemName, getItemType } from './lookup'
import { connectSupplyAndProduction } from './connect-edges'
import type { ProductionStep } from '@/features/planner/lib/production-plan'

/**
 * Genera edges para el flujo completo.
 *
 * @param targetId Item objetivo.
 * @param targetIpm Produccion objetivo por minuto.
 * @param steps Pasos calculados de produccion.
 * @param supplyCountInventory Inventario temporal del supply.
 * @param items Catalogo de items.
 * @param addOrgitalExportSystem Si se agrega el launcher orbital.
 * @param dagreGraph Instancia de Dagre para registrar edges.
 * @returns Lista de edges para React Flow.
 */
export const buildEdges = (
  targetId: string,
  targetIpm: number,
  steps: ProductionStep[],
  supplyCountInventory: Record<string, number>,
  items: Item[],
  addOrgitalExportSystem: boolean,
  dagreGraph: dagre.graphlib.Graph,
): Edge[] => {
  const edges: Edge[] = []

  steps.forEach((step) => {
    step.inputs?.forEach((input) => {
      const inputNeeded = (input.amount_per_minute / step.recipeOutputIpm) * step.targetIpm
      connectSupplyAndProduction({
        edges,
        dagreGraph,
        itemName: getItemName(items, input.id),
        itemId: input.id,
        itemType: getItemType(items, input.id),
        consumerId: step.itemId,
        totalNeeded: inputNeeded,
        supplyCountInventory,
      })
    })
  })

  if (addOrgitalExportSystem) {
    connectSupplyAndProduction({
      edges,
      dagreGraph,
      itemName: getItemName(items, targetId),
      itemId: targetId,
      itemType: getItemType(items, targetId),
      consumerId: ORBITAL_CARGO_LAUNCHER_ID,
      totalNeeded: targetIpm,
      supplyCountInventory,
      isFinalLauncher: true,
    })
  }

  return edges
}
