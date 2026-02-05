import { ITEM_COLORS } from '@/constants/graph'
import BUILDINGS_DATA from '@/data/buildings_and_recipes.json'
import ITEMS_DATA from '@/data/items_catalog.json'
import type { Building, Item } from '@/types/production'
import { Position } from '@xyflow/react'
import dagre from 'dagre'

// Importación de submódulos especializados
import { buildEdges } from './edges.flow'
import { buildLauncherNode, buildProductionNodes, buildSupplyNodes } from './nodes.flow'

// Asignación de datos estáticos con tipado fuerte
const buildings = BUILDINGS_DATA as Building[]
const items = ITEMS_DATA as Item[]

/**
 * Obtiene el color hexadecimal del tema según la categoría del ítem.
 */
const getItemColor = (itemId: string) => {
  const item = items.find((i) => i.id === itemId)
  if (!item) return ITEM_COLORS.default
  return ITEM_COLORS[item.type as keyof typeof ITEM_COLORS] || ITEM_COLORS.default
}

/**
 * FUNCIÓN EXPORTADA: getLayoutedFlow
 * Este es el motor principal que llama React Flow cada vez que cambia un suministro o el objetivo.
 */
export const getLayoutedFlow = (
  targetId: string,
  targetIpm: number,
  totals: Map<string, number>,
  supplies: Record<string, number>,
  onSupplyChange: (id: string, val: number) => void,
  addOrgitalExportSystem: boolean,
) => {
  /**
   * INICIALIZACIÓN DE DAGRE (Algoritmo de Sugiyama)
   * rankdir: 'LR' (Left to Right) - Los materiales fluyen de izquierda a derecha.
   * ranksep: Espacio horizontal entre niveles.
   * nodesep: Espacio vertical entre cajas del mismo nivel.
   */
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 250, nodesep: 80 })

  // PASO 1: Construcción de la lista plana de Nodos
  // Supply Nodes / Nodos de Suministro
  const sNodes = buildSupplyNodes(supplies, items, onSupplyChange, dagreGraph)
  // Production Nodes / Nodos de Máquinas
  const pNodes = buildProductionNodes(targetId, totals, supplies, buildings, items, onSupplyChange, dagreGraph)
  // Launcher Nodes / Nodos de Salida (addOrgitalExportSystem)
  const lNodes = addOrgitalExportSystem ? buildLauncherNode(targetId, targetIpm, items, buildings, dagreGraph) : []

  const nodes = [...sNodes, ...pNodes, ...lNodes]

  // PASO 2: Construcción de la red de cables (Edges)
  const edges = buildEdges(targetId, targetIpm, totals, supplies, buildings, items, addOrgitalExportSystem, getItemColor, dagreGraph)

  /**
   * PASO 3: Ejecución del Layout
   * Dagre calcula matemáticamente las coordenadas X e Y óptimas para minimizar el cruce de cables.
   */
  dagre.layout(dagreGraph)

  // PASO 4: Adaptación a coordenadas de React Flow
  return {
    nodes: nodes.map((n) => {
      const pos = dagreGraph.node(n.id)
      return {
        ...n,
        // TRANSFORMACIÓN DE COORDENADAS:
        // Dagre posiciona basándose en el CENTRO del nodo.
        // React Flow posiciona basándose en la esquina SUPERIOR IZQUIERDA.
        position: { x: pos.x - (n.width || 270) / 2, y: pos.y - (n.height || 330) / 2 },
        // Handles: Entrada por la izquierda, salida por la derecha
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }
    }),
    edges,
  }
}
