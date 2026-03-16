import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID } from '@/features/planner/constants'
import type { Building, Item } from '@/shared/@types/production'
import { type Node } from '@xyflow/react'
import dagre from 'dagre'
import { getBuildingStats, getItemName } from './lookup'
import { findRecipeForItem } from '@/features/planner/lib/recipes'

/**
 * Fabrica de nodos de suministro (inputs).
 *
 * @param supplies Diccionario de supply (itemId -> cantidad).
 * @param items Catalogo de items.
 * @param onSupplyChange Callback para actualizar el supply.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista de nodos de supply.
 */
export const buildSupplyNodes = (
  supplies: Record<string, number>,
  items: Item[],
  onSupplyChange: (id: string, val: number) => void,
  dagreGraph: dagre.graphlib.Graph,
): Node[] => {
  return Object.keys(supplies).map((id) => {
    // Reservamos un poco mas de alto para evitar solapes con produccion.
    dagreGraph.setNode(`supply-${id}`, { width: 200, height: 390 })

    return {
      id: `supply-${id}`,
      type: 'supplyNode',
      draggable: true,
      data: {
        itemId: id,
        itemName: getItemName(items, id),
        supply: supplies[id],
        onSupplyChange,
      },
      position: { x: 0, y: 0 },
    }
  })
}

/**
 * Genera nodos de produccion para items con carga positiva.
 *
 * @param targetId Id del item objetivo.
 * @param totals Totales de produccion por item.
 * @param supplies Supply externo por item.
 * @param buildings Catalogo de edificios.
 * @param items Catalogo de items.
 * @param onSupplyChange Callback para actualizar el supply.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista de nodos de produccion.
 */
export const buildProductionNodes = (
  targetId: string,
  totals: Map<string, number>,
  supplies: Record<string, number>,
  buildings: Building[],
  items: Item[],
  onSupplyChange: (id: string, val: number) => void,
  dagreGraph: dagre.graphlib.Graph,
): Node[] => {
  const nodes: Node[] = []

  totals.forEach((productionQty, id) => {
    if (productionQty <= 0) return

    const { building, recipe } = findRecipeForItem(buildings, id)

    if (building && recipe) {
      const baseIpm = recipe.output.amount_per_minute
      const buildingLoad = productionQty / baseIpm
      const { power, heat } = getBuildingStats(building)

      // Ajuste de altura para compactar en vertical.
      dagreGraph.setNode(id, { width: 260, height: 390 })

      nodes.push({
        id,
        type: 'productionNode',
        draggable: true,
        data: {
          itemId: id,
          itemName: getItemName(items, id),
          buildingId: building.id,
          buildingName: building.name,
          buildingLoad,
          buildingCount: Math.ceil(buildingLoad),
          baseIpm,
          targetIpm: productionQty,
          supply: supplies[id] || 0,
          onSupplyChange,
          buildingPower: power,
          buildingHeat: heat,
          isTarget: id === targetId,
        },
        position: { x: 0, y: 0 },
      })
    }
  })
  return nodes
}

/**
 * Crea el nodo final de exportacion (launcher orbital).
 *
 * @param targetId Id del item objetivo.
 * @param targetIpm Produccion objetivo por minuto.
 * @param items Catalogo de items.
 * @param buildings Catalogo de edificios.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista con el nodo del launcher.
 */
export const buildLauncherNode = (
  targetId: string,
  targetIpm: number,
  items: Item[],
  buildings: Building[],
  dagreGraph: dagre.graphlib.Graph,
): Node[] => {
  const launcherData = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
  const targetItemName = getItemName(items, targetId)
  const { power, heat } = getBuildingStats(launcherData)

  // Ajuste de altura para compactar en vertical.
  dagreGraph.setNode(ORBITAL_CARGO_LAUNCHER_ID, { width: 225, height: 390 })

  return [
    {
      id: ORBITAL_CARGO_LAUNCHER_ID,
      type: 'orbitalCargoLauncherNode',
      draggable: true,
      data: {
        buildingPower: power,
        buildingHeat: heat,
        buildingCount: Math.ceil(targetIpm / ORBITAL_CARGO_LAUNCHER_EXPORT_IPM),
        exportItemName: targetItemName,
        exportItemId: targetId,
      },
      position: { x: 0, y: 0 },
    },
  ]
}


