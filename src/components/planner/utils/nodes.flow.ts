import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID } from '@/constants/planner'
import type { Building, Item } from '@/types/production'
import { type Node } from '@xyflow/react'
import dagre from 'dagre'

/**
 * FABRICA DE NODOS DE SUMINISTRO (INPUTS)
 * Transforma los recursos marcados como "Suministrados" en el sidebar en nodos de entrada.
 * @param supplies - Diccionario de { itemId: cantidad }
 * @param dagreGraph - Instancia del motor de layout para registrar dimensiones
 */
export const buildSupplyNodes = (
  supplies: Record<string, number>,
  items: Item[],
  onSupplyChange: (id: string, val: number) => void,
  dagreGraph: dagre.graphlib.Graph,
): Node[] => {
  return Object.keys(supplies).map((id) => {
    const itemInfo = items.find((i) => i.id === id)

    // IMPORTANTE: Definimos dimensiones fijas para que Dagre calcule los huecos sin colisiones
    dagreGraph.setNode(`supply-${id}`, { width: 170, height: 200 })

    return {
      id: `supply-${id}`,
      type: 'supplyNode', // Mapea al componente Custom Node de React Flow
      draggable: true,
      data: {
        itemId: id,
        itemName: itemInfo?.name || id,
        supply: supplies[id],
        onSupplyChange, // Callback para actualizar el store desde el input del nodo
      },
      position: { x: 0, y: 0 }, // La posición real la calculará Dagre más tarde
    }
  })
}

/**
 * GENERACION DE NODOS DE PRODUCCION
 * * Crea entidades visuales solo para elementos con carga de fabricacion positiva.
 * Integra metadatos de carga de edificio y conteo de unidades fisicas.
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

    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
    const r = b?.recipes?.find((r) => r.output.id === id)

    if (b && r) {
      const baseIpm = r.output.amount_per_minute
      const buildingLoad = productionQty / baseIpm

      dagreGraph.setNode(id, { width: 240, height: 335 })

      nodes.push({
        id,
        type: 'productionNode',
        draggable: true,
        data: {
          itemId: id,
          itemName: items.find((i) => i.id === id)?.name || id,
          buildingId: b.id,
          buildingName: b.name,
          buildingLoad,
          buildingCount: Math.ceil(buildingLoad),
          baseIpm,
          targetIpm: productionQty,
          supply: supplies[id] || 0,
          onSupplyChange,
          buildingPower: b.power || 0,
          buildingHeat: b.heat || 0,
          isTarget: id === targetId,
        },
        position: { x: 0, y: 0 },
      })
    }
  })
  return nodes
}

/**
 * NODO DE EXPORTACIÓN FINAL
 * Representa el sumidero de la cadena de producción (Lanzador de Carga).
 */
export const buildLauncherNode = (
  targetId: string,
  targetIpm: number,
  items: Item[],
  buildings: Building[],
  dagreGraph: dagre.graphlib.Graph,
): Node[] => {
  const launcherData = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
  // Buscamos los datos del ítem que se está fabricando (el target)
  const targetItemInfo = items.find((i) => i.id === targetId)

  dagreGraph.setNode(ORBITAL_CARGO_LAUNCHER_ID, { width: 225, height: 270 })

  return [
    {
      id: ORBITAL_CARGO_LAUNCHER_ID,
      type: 'orbitalCargoLauncherNode',
      draggable: true,
      data: {
        buildingPower: launcherData?.power || 0,
        buildingHeat: launcherData?.heat || 0,
        buildingCount: Math.ceil(targetIpm / ORBITAL_CARGO_LAUNCHER_EXPORT_IPM),
        exportItemName: targetItemInfo?.name || targetId,
        exportItemId: targetId,
      },
      position: { x: 0, y: 0 },
    },
  ]
}
