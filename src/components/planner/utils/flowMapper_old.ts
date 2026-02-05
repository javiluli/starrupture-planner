import { type Edge, type Node, Position } from '@xyflow/react'
import dagre from 'dagre'
import { ITEM_COLORS } from '@/constants/graph'
import BUILDINGS_DATA from '@/data/buildings_and_recipes.json'
import ITEMS_DATA from '@/data/items_catalog.json'
import type { Building, Item } from '@/types/production'

const buildings = BUILDINGS_DATA as Building[]
const items = ITEMS_DATA as Item[]

/**
 * BUSCADOR DE COLORES:
 * Mira de qué tipo es el material (mena, lingote, etc.) y le da su color
 * para que los cables no sean todos grises.
 */
const getItemColor = (itemId: string) => {
  const item = items.find((i) => i.id === itemId)
  if (!item) return ITEM_COLORS.default
  return ITEM_COLORS[item.type as keyof typeof ITEM_COLORS] || ITEM_COLORS.default
}

/**
 * MOTOR DE LOGÍSTICA Y LAYOUT:
 * Aquí decidimos qué aparece en pantalla y dónde se coloca.
 */
export const getLayoutedFlow = (
  targetId: string,
  targetIpm: number,
  totals: Map<string, number>,
  supplies: Record<string, number>,
  onSupplyChange: (id: string, val: number) => void,
  addOrgitalExportSystem: boolean,
) => {
  // Configuración de Dagre (el algoritmo que ordena las cajitas de izquierda a derecha)
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 250, nodesep: 80 })

  const nodes: Node[] = []
  const edges: Edge[] = []

  // --- PASO 1: CREACIÓN DE NODOS (CAJAS) ---

  // A. NODOS DE SUMINISTRO (SUPPLY):
  // Recorremos los suministros que el usuario ha añadido desde el sidebar.
  // El nodo aparecerá aunque la cantidad sea 0 (para que el usuario lo vea al añadirlo).
  Object.keys(supplies).forEach((id) => {
    const itemInfo = items.find((i) => i.id === id)

    nodes.push({
      id: `supply-${id}`,
      type: 'supplyNode',
      draggable: true, // Importante: Puedes moverlo libremente por el flow
      data: {
        itemId: id,
        itemName: itemInfo?.name || id,
        supply: supplies[id],
        onSupplyChange,
      },
      position: { x: 0, y: 0 },
    })
    // Le decimos a Dagre el tamaño de la caja de suministro
    dagreGraph.setNode(`supply-${id}`, { width: 180, height: 120 })
  })

  // B. NODOS DE PRODUCCIÓN (MÁQUINAS):
  // Recorremos los totales calculados por la fábrica.
  totals.forEach((qty, id) => {
    const supplyAmount = supplies[id] || 0
    // netQty = Lo que realmente tenemos que fabricar tras restar el suministro externo.
    const netQty = Math.max(0, qty - supplyAmount)

    /**
     * REGLA DE LIMPIEZA:
     * Si el suministro externo cubre el 100% de la demanda, netQty será 0.
     * En ese caso, NO creamos el nodo de producción (la máquina desaparece).
     */
    if (netQty > 0) {
      const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
      const r = b?.recipes?.find((r) => r.output.id === id)

      if (b && r) {
        const baseIpm = r.output.amount_per_minute
        const buildingLoad = netQty / baseIpm

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
            targetIpm: qty, // Mostramos la demanda bruta para información
            supply: supplyAmount,
            onSupplyChange,
            buildingPower: b.power || 0,
            buildingHeat: b.heat || 0,
            isTarget: id === targetId,
          },
          position: { x: 0, y: 0 },
        })
        // Le decimos a Dagre el tamaño de la caja de producción
        dagreGraph.setNode(id, { width: 200, height: 300 })
      }
    }
  })

  // --- PASO 2: CREACIÓN DE CONEXIONES (CABLES) ---

  totals.forEach((qty, id) => {
    const supplyAmount = supplies[id] || 0
    const netQty = Math.max(0, qty - supplyAmount)

    // Si este nodo no se fabrica (porque el supply lo cubre todo),
    // no buscamos sus ingredientes a menos que sea el objetivo final.
    if (netQty <= 0 && id !== targetId) return

    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
    const r = b?.recipes?.find((r) => r.output.id === id)
    if (!r) return

    r.inputs?.forEach((input) => {
      // Calculamos cuánto material de este ingrediente necesita la demanda neta actual
      const inputTotalNeeded = (input.amount_per_minute / r.output.amount_per_minute) * netQty
      if (inputTotalNeeded <= 0) return

      /**
       * CONEXIÓN DESDE EL SUMINISTRO EXTERNO:
       * Si existe un nodo supply para este ingrediente, tiramos el cable verde punteado.
       */
      if (supplies[input.id] !== undefined) {
        const amountFromSupply = Math.min(supplies[input.id], inputTotalNeeded)
        edges.push({
          id: `e-supply-${input.id}-${id}`,
          source: `supply-${input.id}`,
          target: id,
          label: `${amountFromSupply.toFixed(1)}/m`,
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 3, strokeDasharray: '5, 5' },
          labelStyle: { fill: '#4ade80', fontSize: 10, fontWeight: 800 },
        })
        dagreGraph.setEdge(`supply-${input.id}`, id)
      }

      /**
       * CONEXIÓN DESDE PRODUCCIÓN INTERNA:
       * Si el suministro no cubre todo el ingrediente, el resto viene de la máquina fabricadora.
       */
      const inputProducedNet = Math.max(0, (totals.get(input.id) || 0) - (supplies[input.id] || 0))
      if (inputProducedNet > 0) {
        const amountFromProd = Math.min(inputProducedNet, inputTotalNeeded)
        edges.push({
          id: `e-${input.id}-${id}`,
          source: input.id,
          target: id,
          label: `${items.find((i) => i.id === input.id)?.name} x${amountFromProd.toFixed(1)}/m`,
          style: {
            stroke: getItemColor(input.id),
            strokeWidth: 3,
            opacity: 0.8,
          },
          labelStyle: { fill: 'white', fontSize: 11, fontWeight: 700 },
        })
        dagreGraph.setEdge(input.id, id)
      }
    })
  })

  // --- PASO 3: NODO DE EXPORTACIÓN (ORBITAL LAUNCHER) ---

  if (addOrgitalExportSystem) {
    const launcherData = buildings.find((b) => b.id === 'orbital_cargo_launcher')
    const launcherId = 'terminal-launcher'
    // Buscamos los datos del ítem que se está fabricando (el target)
    const targetItemInfo = items.find((i) => i.id === targetId)
    const launcherLoad = targetIpm / 10

    nodes.push({
      id: launcherId,
      type: 'orbitalExportSystemNode',
      draggable: true,
      data: {
        buildingName: 'Orbital Export System',
        buildingLoad: launcherLoad,
        buildingCount: Math.ceil(launcherLoad),
        targetIpm: targetIpm,
        exportItemName: targetItemInfo?.name || targetId,
        exportItemId: targetId,
        buildingPower: launcherData?.power || 0,
        buildingHeat: launcherData?.heat || 0,
      },
      position: { x: 0, y: 0 },
    })
    dagreGraph.setNode(launcherId, { width: 250, height: 300 })

    // Conectamos el origen (Supply o Máquina) al Lanzador
    const finalSource = supplies[targetId] >= targetIpm ? `supply-${targetId}` : targetId

    edges.push({
      id: `e-final-launcher`,
      source: finalSource,
      target: launcherId,
      label: `${targetIpm.toFixed(1)}/m`,
      style: { stroke: '#f97316', strokeWidth: 4 },
      labelStyle: { fill: 'white', fontSize: 12, fontWeight: 700 },
    })
    dagreGraph.setEdge(finalSource, launcherId)
  }

  // --- PASO 4: CALCULAR LAYOUT Y DEVOLVER RESULTADO ---

  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((n) => {
      const pos = dagreGraph.node(n.id)
      return {
        ...n,
        // Centramos las coordenadas (Dagre usa el centro, React Flow la esquina)
        position: { x: pos.x - (n.width || 200) / 2, y: pos.y - (n.height || 300) / 2 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }
    }),
    edges,
  }
}
