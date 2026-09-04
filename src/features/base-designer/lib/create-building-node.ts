import type { Building } from '@/shared/@types/building.type'
import type { XYPosition } from '@xyflow/react'
import { BASE_DESIGNER_GRID_SIZE, BASE_FIELD_NODE_ID } from '../base-designer.config'
import type { BaseDesignerBuildingNode, BaseDesignerNode } from '../types'
import { footprintToPixels, getBaseFieldPixelSize, getBuildingFootprint } from './building-dimensions'
import { findNearestAvailableBuildingPosition } from './building-collision'

interface BuildingPlacementOptions {
  buildingId: string
  absolutePosition: XYPosition
  parentPosition?: XYPosition
}

interface CreateBuildingNodeOptions extends Omit<BuildingPlacementOptions, 'buildingId'> {
  building: Building
  instanceId: string
}

const snapToGrid = (value: number) => Math.round(value / BASE_DESIGNER_GRID_SIZE) * BASE_DESIGNER_GRID_SIZE
const clamp = (value: number, maximum: number) => Math.min(Math.max(value, 0), maximum)

/**
 * Converts a center point in flow coordinates into the snapped top-left position
 * used by a building node. Preview and final placement share this calculation.
 */
export const calculateBuildingPlacement = ({
  buildingId,
  absolutePosition,
  parentPosition = { x: 0, y: 0 },
}: BuildingPlacementOptions) => {
  const size = footprintToPixels(getBuildingFootprint(buildingId))
  const fieldSize = getBaseFieldPixelSize()
  const relativeX = absolutePosition.x - parentPosition.x - size.width / 2
  const relativeY = absolutePosition.y - parentPosition.y - size.height / 2

  return {
    size,
    position: {
      x: clamp(snapToGrid(relativeX), fieldSize - size.width),
      y: clamp(snapToGrid(relativeY), fieldSize - size.height),
    },
  }
}

/** Builds one controlled React Flow node from immutable building data and a canvas position. */
export const createBuildingNode = ({
  building,
  absolutePosition,
  instanceId,
  parentPosition = { x: 0, y: 0 },
}: CreateBuildingNodeOptions): BaseDesignerBuildingNode => {
  const recipes = building.recipes ?? []
  const recipeProfiles = recipes.map((recipe) => ({
    outputItemId: recipe.output.id,
    inputItemIds: recipe.inputs.map((input) => input.id),
  }))
  const { size, position } = calculateBuildingPlacement({
    buildingId: building.id,
    absolutePosition,
    parentPosition,
  })

  return {
    id: `building:${instanceId}`,
    type: 'building',
    parentId: BASE_FIELD_NODE_ID,
    extent: 'parent',
    position,
    data: {
      kind: 'building',
      buildingId: building.id,
      label: building.name,
      buildingType: building.type,
      width: size.width,
      height: size.height,
      acceptsItems: recipes.some((recipe) => recipe.inputs.length > 0),
      suppliesItems: recipes.length > 0,
      recipeProfiles,
    },
    style: size,
  }
}

/** Busca una posicion libre para la colocacion por teclado. */
export const findAvailableBuildingPosition = (nodes: BaseDesignerNode[], buildingId: string): XYPosition | undefined => {
  const size = footprintToPixels(getBuildingFootprint(buildingId))
  const position = findNearestAvailableBuildingPosition(nodes, size)
  if (!position) return undefined

  return {
    x: position.x + size.width / 2,
    y: position.y + size.height / 2,
  }
}