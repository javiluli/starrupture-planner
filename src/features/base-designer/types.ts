import type { Edge, Node } from '@xyflow/react'

export interface BuildingFootprint {
  columns: number
  rows: number
}

export type BaseDesignerFieldNodeData = {
  kind: 'field'
} & Record<string, unknown>

export type BaseDesignerCoreNodeData = {
  kind: 'core'
  buildingId: 'base_core'
  width: number
  height: number
} & Record<string, unknown>

export interface BaseDesignerRecipeProfile {
  outputItemId: string
  inputItemIds: string[]
}

export interface BaseDesignerEdgeData extends Record<string, unknown> {
  compatibleItemIds: string[]
  itemId?: string
}

export type BaseDesignerBuildingNodeData = {
  kind: 'building'
  buildingId: string
  label: string
  buildingType: string
  width: number
  height: number
  acceptsItems: boolean
  suppliesItems: boolean
  recipeProfiles: BaseDesignerRecipeProfile[]
  selectedRecipeOutputId?: string
} & Record<string, unknown>

export type BaseDesignerFieldNode = Node<BaseDesignerFieldNodeData, 'group'>
export type BaseDesignerCoreNode = Node<BaseDesignerCoreNodeData, 'core'>
export type BaseDesignerBuildingNode = Node<BaseDesignerBuildingNodeData, 'building'>
export type BaseDesignerNode = BaseDesignerFieldNode | BaseDesignerCoreNode | BaseDesignerBuildingNode
export type BaseDesignerEdge = Edge<BaseDesignerEdgeData>

export interface BaseDesignerStats {
  buildingCount: number
  generatedPower: number
  consumedPower: number
  powerBalance: number
  heat: number
  heatCapacity: number
}
