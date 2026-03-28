import type { Node, Edge } from '@xyflow/react'
import { Position } from '@xyflow/react'
import dagre from 'dagre'
import type { Building, Item } from '@/shared/@types/production'
import { DAGRE_GRAPH_CONFIG } from '@/features/planner/flow/config/dagre-config'
import { buildLauncherNode, buildProductionNodes, buildSupplyNodes } from '@/features/planner/flow/core/flow-nodes'
import { buildEdges } from '@/features/planner/flow/core/flow-edges'
import { calculateProductionTotals, toFlowStats } from '@/features/planner/lib/planner-logic'

export interface FlowBuildParams {
  /** Lista de items del juego (nombre ya traducido). */
  items: Item[]
  /** Lista de edificios con recetas. */
  buildings: Building[]
  /** Id del item objetivo a producir. */
  targetId: string
  /** Tasa objetivo en items por minuto. */
  targetIpm: number
  /** Inventario de suministros externos. */
  supplyCountByItem: Record<string, number>
  /** Indica si hay exportacion orbital. */
  isExportable: boolean
  /** Callback para actualizar supply desde nodos. */
  setSupplyCount: (id: string, val: number) => void
}

export interface FlowBuildResult {
  nodes: Node[]
  edges: Edge[]
  stats: ReturnType<typeof toFlowStats>
}

/**
 * API publica para construir el flujo completo y sus stats.
 *
 * Nota: contiene el layout completo para evitar pasos intermedios.
 *
 * @param params.items Lista de items del juego.
 * @param params.buildings Lista de edificios con recetas.
 * @param params.targetId Id del item objetivo.
 * @param params.targetIpm Produccion objetivo por minuto.
 * @param params.supplyCountByItem Suministros externos por item.
 * @param params.isExportable Si se agrega exportacion orbital.
 * @param params.setSupplyCount Callback para actualizar supply desde nodos.
 * @returns Nodos, edges y stats calculadas.
 */
export const buildProductionFlow = ({
  items,
  buildings,
  targetId,
  targetIpm,
  supplyCountByItem,
  isExportable,
  setSupplyCount,
}: FlowBuildParams): FlowBuildResult => {
  // 1) Calculamos la demanda neta y stats basicas.
  const totalsResult = calculateProductionTotals(buildings, targetId, targetIpm, supplyCountByItem, isExportable)

  // 2) Inicializamos el grafo de Dagre con la config base.
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph(DAGRE_GRAPH_CONFIG)

  // 3) Construimos nodos de supply (inputs externos).
  const supplyNodes = buildSupplyNodes(supplyCountByItem, buildings, items, setSupplyCount, dagreGraph)

  // 4) Construimos nodos de produccion (fabricacion interna).
  const productionNodes = buildProductionNodes(
    targetId,
    totalsResult.totals,
    supplyCountByItem,
    buildings,
    items,
    setSupplyCount,
    dagreGraph,
  )

  // 5) Construimos nodo final de exportacion si aplica.
  const launcherNodes = isExportable ? buildLauncherNode(targetId, targetIpm, items, buildings, dagreGraph) : []

  // 6) Unimos nodos en el orden esperado por el layout.
  const nodes = [...supplyNodes, ...productionNodes, ...launcherNodes]

  // 7) Construimos edges con estilos y consumo de supply.
  const edges = buildEdges(
    targetId,
    targetIpm,
    totalsResult.totals,
    supplyCountByItem,
    buildings,
    items,
    isExportable,
    dagreGraph,
  )

  // 8) Ejecutamos el layout de Dagre.
  dagre.layout(dagreGraph)

  // 9) Ajustamos posiciones para React Flow (Dagre centra, React Flow usa esquina).
  const layoutedNodes = nodes.map((n) => {
    const pos = dagreGraph.node(n.id)
    return {
      ...n,
      position: {
        x: pos.x - (n.width || 260) / 2,
        y: pos.y - (n.height || 390) / 2,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
  })

  // 10) Devolvemos nodos, edges y stats finales.
  return {
    nodes: layoutedNodes,
    edges,
    stats: toFlowStats(totalsResult),
  }
}
