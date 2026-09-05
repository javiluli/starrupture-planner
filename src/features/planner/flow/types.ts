import type { Node } from '@xyflow/react'

export type ProductionNodeData = {
  buildingId: string
  buildingName: string
  buildingPower: number
  buildingHeat: number
  buildingLoad: number
  buildingCount: number
  itemId: string
  itemName: string
  baseIpm: number
  targetIpm: number
}

export type SupplyNodeData = {
  buildingId: string
  buildingName: string
  buildingPower: number
  buildingHeat: number
  itemId: string
  itemName: string
  supplyCount: number
}

export type OrbitalCargoLauncherNodeData = {
  buildingPower: number
  buildingHeat: number
  buildingCount: number
  exportItemId: string
  exportItemName: string
}

export type ProductionMachineNode = Node<ProductionNodeData, 'productionNode'>
export type SupplyFlowNode = Node<SupplyNodeData, 'supplyNode'>
export type OrbitalCargoLauncherFlowNode = Node<OrbitalCargoLauncherNodeData, 'orbitalCargoLauncherNode'>

export type PlannerFlowNodeByType = {
  productionNode: ProductionMachineNode
  supplyNode: SupplyFlowNode
  orbitalCargoLauncherNode: OrbitalCargoLauncherFlowNode
}

export type PlannerFlowNode = PlannerFlowNodeByType[keyof PlannerFlowNodeByType]
