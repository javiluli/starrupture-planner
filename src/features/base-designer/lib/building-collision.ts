import type { XYPosition } from '@xyflow/react'
import { BASE_DESIGNER_GRID_SIZE } from '../base-designer.config'
import type { BaseDesignerBuildingNode, BaseDesignerNode } from '../types'
import { getBaseFieldPixelSize } from './building-dimensions'

const isBuildingNode = (node: BaseDesignerNode): node is BaseDesignerBuildingNode =>
  node.type === 'building' && node.data.kind === 'building'

export interface BuildingPlacementRect {
  position: XYPosition
  width: number
  height: number
}

const getBlockingNodeRect = (node: BaseDesignerNode): BuildingPlacementRect | undefined => {
  if (node.data.kind === 'field') return undefined

  return {
    position: node.position,
    width: node.data.width,
    height: node.data.height,
  }
}

/** Los bordes pueden tocarse; solo se considera colision cuando las areas se cruzan. */
export const doBuildingRectsOverlap = (left: BuildingPlacementRect, right: BuildingPlacementRect) =>
  left.position.x < right.position.x + right.width &&
  left.position.x + left.width > right.position.x &&
  left.position.y < right.position.y + right.height &&
  left.position.y + left.height > right.position.y

/** Comprueba un footprint contra todos los buildings y nodos de sistema que ocupan espacio. */
export const isBuildingAreaAvailable = (
  placement: BuildingPlacementRect,
  nodes: BaseDesignerNode[],
  ignoredNodeIds: ReadonlySet<string> = new Set(),
) =>
  nodes.every((node) => {
    if (ignoredNodeIds.has(node.id)) return true
    const occupied = getBlockingNodeRect(node)
    return !occupied || !doBuildingRectsOverlap(placement, occupied)
  })

export const isBuildingNodePlacementAvailable = (node: BaseDesignerBuildingNode, nodes: BaseDesignerNode[]) =>
  isBuildingAreaAvailable({ position: node.position, width: node.data.width, height: node.data.height }, nodes, new Set([node.id]))

/** Valida de forma conjunta las posiciones candidatas emitidas por un drag simple o multiple. */
export const areChangedBuildingPositionsAvailable = (nodes: BaseDesignerNode[], changedNodeIds: ReadonlySet<string>) =>
  nodes.every((node) => {
    if (!changedNodeIds.has(node.id) || !isBuildingNode(node)) return true
    return isBuildingNodePlacementAvailable(node, nodes)
  })

/** Busca la celda libre mas cercana a una posicion preferida dentro del campo. */
export const findNearestAvailableBuildingPosition = (
  nodes: BaseDesignerNode[],
  size: { width: number; height: number },
  preferredPosition: XYPosition = { x: 0, y: 0 },
): XYPosition | undefined => {
  const fieldSize = getBaseFieldPixelSize()
  const maximumX = fieldSize - size.width
  const maximumY = fieldSize - size.height
  const preferredX = Math.min(Math.max(preferredPosition.x, 0), maximumX)
  const preferredY = Math.min(Math.max(preferredPosition.y, 0), maximumY)
  let nearestPosition: XYPosition | undefined
  let nearestDistance = Number.POSITIVE_INFINITY

  for (let y = 0; y <= maximumY; y += BASE_DESIGNER_GRID_SIZE) {
    for (let x = 0; x <= maximumX; x += BASE_DESIGNER_GRID_SIZE) {
      const distance = Math.abs(x - preferredX) + Math.abs(y - preferredY)
      if (distance >= nearestDistance) continue
      if (!isBuildingAreaAvailable({ position: { x, y }, ...size }, nodes)) continue

      nearestPosition = { x, y }
      nearestDistance = distance
      if (distance === 0) return nearestPosition
    }
  }

  return nearestPosition
}
