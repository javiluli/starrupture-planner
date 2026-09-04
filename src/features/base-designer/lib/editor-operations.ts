import { BASE_DESIGNER_GRID_SIZE } from '../base-designer.config'
import type { BaseDesignerBuildingNode, BaseDesignerEdge, BaseDesignerNode } from '../types'
import { findNearestAvailableBuildingPosition } from './building-collision'

const HISTORY_LIMIT = 50
const DUPLICATE_OFFSET = BASE_DESIGNER_GRID_SIZE * 2

export interface BaseDesignerSnapshot {
  nodes: BaseDesignerNode[]
  edges: BaseDesignerEdge[]
}

export interface BaseDesignerHistory {
  past: BaseDesignerSnapshot[]
  future: BaseDesignerSnapshot[]
  dragStart?: BaseDesignerSnapshot
}

export const EMPTY_BASE_DESIGNER_HISTORY: BaseDesignerHistory = { past: [], future: [] }

const cloneNode = (node: BaseDesignerNode): BaseDesignerNode => ({
  ...node,
  position: { ...node.position },
  data: { ...node.data },
  ...(node.style ? { style: { ...node.style } } : {}),
}) as BaseDesignerNode

const cloneEdge = (edge: BaseDesignerEdge): BaseDesignerEdge => ({
  ...edge,
  data: edge.data ? { ...edge.data } : edge.data,
  style: edge.style ? { ...edge.style } : edge.style,
})

/** Captures an immutable runtime snapshot for undo and redo. */
export const captureBaseDesignerSnapshot = (
  nodes: BaseDesignerNode[],
  edges: BaseDesignerEdge[],
): BaseDesignerSnapshot => ({
  nodes: nodes.map(cloneNode),
  edges: edges.map(cloneEdge),
})

/** Comprueba si un drag ha cambiado realmente alguna posicion respecto a su snapshot inicial. */
export const haveNodePositionsChanged = (snapshot: BaseDesignerSnapshot, nodes: BaseDesignerNode[]) => {
  const currentNodeById = new Map(nodes.map((node) => [node.id, node]))
  return snapshot.nodes.some((node) => {
    const currentNode = currentNodeById.get(node.id)
    if (!currentNode) return true
    return currentNode.position.x !== node.position.x || currentNode.position.y !== node.position.y
  })
}
/** Adds one user-visible operation to history and invalidates the redo branch. */
export const pushBaseDesignerHistory = (
  history: BaseDesignerHistory,
  snapshot: BaseDesignerSnapshot,
): BaseDesignerHistory => ({
  past: [...history.past, snapshot].slice(-HISTORY_LIMIT),
  future: [],
})

export const undoBaseDesignerHistory = (
  history: BaseDesignerHistory,
  current: BaseDesignerSnapshot,
): { snapshot: BaseDesignerSnapshot; history: BaseDesignerHistory } | undefined => {
  const snapshot = history.past.at(-1)
  if (!snapshot) return undefined

  return {
    snapshot,
    history: {
      past: history.past.slice(0, -1),
      future: [current, ...history.future].slice(0, HISTORY_LIMIT),
    },
  }
}

export const redoBaseDesignerHistory = (
  history: BaseDesignerHistory,
  current: BaseDesignerSnapshot,
): { snapshot: BaseDesignerSnapshot; history: BaseDesignerHistory } | undefined => {
  const [snapshot, ...future] = history.future
  if (!snapshot) return undefined

  return {
    snapshot,
    history: {
      past: [...history.past, current].slice(-HISTORY_LIMIT),
      future,
    },
  }
}

/** Duplica los buildings seleccionados en las posiciones libres mas cercanas. */
export const duplicateSelectedBuildingNodes = (
  nodes: BaseDesignerNode[],
  createInstanceId: () => string,
): BaseDesignerNode[] | undefined => {
  const selectedBuildings = nodes.filter(
    (node): node is BaseDesignerBuildingNode => node.data.kind === 'building' && Boolean(node.selected),
  )
  if (selectedBuildings.length === 0) return undefined

  const duplicates: BaseDesignerBuildingNode[] = []
  for (const node of selectedBuildings) {
    const size = { width: node.data.width, height: node.data.height }
    const position = findNearestAvailableBuildingPosition(
      [...nodes, ...duplicates],
      size,
      { x: node.position.x + DUPLICATE_OFFSET, y: node.position.y + DUPLICATE_OFFSET },
    )
    if (!position) continue

    duplicates.push({
      ...cloneNode(node),
      id: `building:${createInstanceId()}`,
      position,
      selected: true,
    } as BaseDesignerBuildingNode)
  }
  if (duplicates.length === 0) return undefined

  const deselectedNodes = nodes.map((node) => (node.selected ? ({ ...node, selected: false } as BaseDesignerNode) : node))
  return [...deselectedNodes, ...duplicates]
}
/** Elimina la seleccion editable y todas las conexiones asociadas a sus buildings. */
export const removeSelectedBaseDesignerElements = (
  nodes: BaseDesignerNode[],
  edges: BaseDesignerEdge[],
): BaseDesignerSnapshot | undefined => {
  const selectedBuildingIds = new Set(
    nodes.flatMap((node) => (node.data.kind === 'building' && node.selected ? [node.id] : [])),
  )
  const hasSelectedEdges = edges.some((edge) => edge.selected)
  if (selectedBuildingIds.size === 0 && !hasSelectedEdges) return undefined

  return {
    nodes: nodes.filter((node) => !selectedBuildingIds.has(node.id)),
    edges: edges.filter(
      (edge) => !edge.selected && !selectedBuildingIds.has(edge.source) && !selectedBuildingIds.has(edge.target),
    ),
  }
}
