import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID, PACKAGE_RECEIVER_ID } from '@/features/planner/constants'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import type { Graph } from '@dagrejs/dagre'
import { getBuildingStats, getItemName } from './lookup'
import type { ProductionStep } from '@/features/planner/lib/production-plan'
import { isPositiveSupplyCount } from '@/features/planner/lib/supply-count'
import type { OrbitalCargoLauncherFlowNode, ProductionMachineNode, SupplyFlowNode } from '@/features/planner/flow/types'
import { buildProductionNodeData } from './production-node-data'

/**
 * Fabrica de nodos de suministro (inputs).
 *
 * @param supplyCountByItem Diccionario de supply (itemId -> cantidad).
 * @param buildings Catalogo de edificios.
 * @param items Catalogo de items.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista de nodos de supply.
 */
export const buildSupplyNodes = (
  supplyCountByItem: Record<string, number>,
  buildings: readonly Building[],
  items: readonly Item[],
  dagreGraph: Graph,
): SupplyFlowNode[] => {
  const buildingData = buildings.find((b) => b.id === PACKAGE_RECEIVER_ID)
  const { power, heat } = getBuildingStats(buildingData)

  return Object.entries(supplyCountByItem).flatMap(([id, supplyCount]): SupplyFlowNode[] => {
    if (!isPositiveSupplyCount(supplyCount)) return []

    // Reservamos un poco mas de alto para evitar solapes con produccion.
    dagreGraph.setNode(`supply-${id}`, { width: 260, height: 350 })

    return [
      {
        id: `supply-${id}`,
        type: 'supplyNode',
        draggable: true,
        data: {
          buildingId: buildingData?.id ?? PACKAGE_RECEIVER_ID,
          buildingName: buildingData?.name ?? 'Cargo Receiver',
          buildingPower: power,
          buildingHeat: heat,
          itemId: id,
          itemName: getItemName(items, id),
          supplyCount,
        },
        position: { x: 0, y: 0 },
      },
    ]
  })
}

/**
 * Genera nodos de produccion para items con carga positiva.
 *
 * @param steps Pasos de produccion calculados.
 * @param items Catalogo de items.
 * @param dagreGraph Instancia de Dagre para registrar dimensiones.
 * @returns Lista de nodos de produccion.
 */
export const buildProductionNodes = (
  steps: readonly ProductionStep[],
  items: readonly Item[],
  dagreGraph: Graph,
): ProductionMachineNode[] =>
  steps.map((step): ProductionMachineNode => {
    // Ajuste de altura para compactar en vertical.
    dagreGraph.setNode(step.itemId, { width: 260, height: 350 })

    return {
      id: step.itemId,
      type: 'productionNode',
      draggable: true,
      data: buildProductionNodeData(step, items),
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
  items: readonly Item[],
  buildings: readonly Building[],
  dagreGraph: Graph,
): OrbitalCargoLauncherFlowNode[] => {
  const buildingData = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
  const targetItemName = getItemName(items, targetId)
  const { power, heat } = getBuildingStats(buildingData)

  // Ajuste de altura para compactar en vertical.
  dagreGraph.setNode(ORBITAL_CARGO_LAUNCHER_ID, { width: 225, height: 350 })

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
