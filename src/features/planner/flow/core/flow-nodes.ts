import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID, PACKAGE_RECEIVER_ID } from '@/features/planner/constants'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { type Node } from '@xyflow/react'
import dagre from 'dagre'
import { getBuildingStats, getItemName } from './lookup'
import type { ProductionStep } from '@/features/planner/lib/production-plan'

/**
 * Fabrica de nodos de suministro (inputs).
 *
 * @param supplyCountByItem Diccionario de supply (itemId -> cantidad).
 * @param buildings Catalogo de edificios.
 * @param items Catalogo de items.
 * @param onSupplyCountChange Callback para actualizar el supply.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista de nodos de supply.
 */
export const buildSupplyNodes = (
  supplyCountByItem: Record<string, number>,
  buildings: Building[],
  items: Item[],
  onSupplyCountChange: (id: string, val: number) => void,
  dagreGraph: dagre.graphlib.Graph,
): Node[] => {
  const buildingData = buildings.find((b) => b.id === PACKAGE_RECEIVER_ID)
  const { power, heat } = getBuildingStats(buildingData)

  return Object.keys(supplyCountByItem).map((id) => {
    // Reservamos un poco mas de alto para evitar solapes con produccion.
    dagreGraph.setNode(`supply-${id}`, { width: 200, height: 390 })

    return {
      id: `supply-${id}`,
      type: 'supplyNode',
      draggable: true,
      data: {
        buildingId: buildingData?.id,
        buildingName: buildingData?.name,
        buildingPower: power,
        buildingHeat: heat,
        itemId: id,
        itemName: getItemName(items, id),
        supplyCount: supplyCountByItem[id],
        onSupplyCountChange,
      },
      position: { x: 0, y: 0 },
    }
  })
}

/**
 * Genera nodos de produccion para items con carga positiva.
 *
 * @param targetId Id del item objetivo.
 * @param steps Pasos de produccion calculados.
 * @param items Catalogo de items.
 * @param onSupplyCountChange Callback para actualizar el supply.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista de nodos de produccion.
 */
export const buildProductionNodes = (
  targetId: string,
  steps: ProductionStep[],
  items: Item[],
  onSupplyCountChange: (id: string, val: number) => void,
  dagreGraph: dagre.graphlib.Graph,
): Node[] =>
  steps.map((step) => {
    // Ajuste de altura para compactar en vertical.
    dagreGraph.setNode(step.itemId, { width: 260, height: 390 })

    return {
      id: step.itemId,
      type: 'productionNode',
      draggable: true,
      data: {
        itemId: step.itemId,
        itemName: getItemName(items, step.itemId),
        buildingId: step.buildingId,
        buildingName: step.buildingName,
        buildingLoad: step.buildingLoad,
        buildingCount: step.buildingCount,
        baseIpm: step.recipeOutputIpm,
        targetIpm: step.targetIpm,
        supplyCount: step.supplyCount,
        onSupplyCountChange,
        buildingPower: step.buildingPower,
        buildingHeat: step.buildingHeat,
        isTarget: step.itemId === targetId,
      },
      position: { x: 0, y: 0 },
    }
  })

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
  const buildingData = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
  const targetItemName = getItemName(items, targetId)
  const { power, heat } = getBuildingStats(buildingData)

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
