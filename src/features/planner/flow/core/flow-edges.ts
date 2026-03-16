import { ORBITAL_CARGO_LAUNCHER_ID } from '@/features/planner/constants'
import type { Building, Item } from '@/shared/@types/production'
import { type Edge } from '@xyflow/react'
import dagre from 'dagre'
import { buildSupplyInventory } from './supply-inventory'
import { getItemName, getItemType } from './lookup'
import { connectSupplyAndProduction } from './connect-edges'
import { findRecipeForItem } from '@/features/planner/lib/recipes'

/**
 * Genera edges para el flujo completo.
 *
 * @param targetId Item objetivo.
 * @param targetIpm Produccion objetivo por minuto.
 * @param totals Totales de produccion por item.
 * @param supplies Supply externo por item.
 * @param buildings Catalogo de edificios.
 * @param items Catalogo de items.
 * @param addOrgitalExportSystem Si se agrega el launcher orbital.
 * @param dagreGraph Instancia de Dagre para registrar edges.
 * @returns Lista de edges para React Flow.
 */
export const buildEdges = (
  targetId: string,
  targetIpm: number,
  totals: Map<string, number>,
  supplies: Record<string, number>,
  buildings: Building[],
  items: Item[],
  addOrgitalExportSystem: boolean,
  dagreGraph: dagre.graphlib.Graph,
): Edge[] => {
  const edges: Edge[] = []
  const supplyInventory = buildSupplyInventory(supplies)

  totals.forEach((prodQty, nodeId) => {
    const { recipe } = findRecipeForItem(buildings, nodeId)
    recipe?.inputs?.forEach((input) => {
      const inputNeeded = (input.amount_per_minute / recipe.output.amount_per_minute) * prodQty
      connectSupplyAndProduction({
        edges,
        dagreGraph,
        itemName: getItemName(items, input.id),
        itemId: input.id,
        itemType: getItemType(items, input.id),
        consumerId: nodeId,
        totalNeeded: inputNeeded,
        supplyInventory,
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
      supplyInventory,
      isFinalLauncher: true,
    })
  }

  return edges
}


