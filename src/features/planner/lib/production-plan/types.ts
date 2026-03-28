import type { Building, RecipeInput } from '@/shared/@types/building.type'

export interface ProductionStep {
  itemId: string
  buildingId: string
  buildingName: string
  recipeOutputIpm: number
  targetIpm: number
  buildingLoad: number
  buildingCount: number
  buildingPower: number
  buildingHeat: number
  supplyCount: number
  inputs: RecipeInput[]
}

export interface ProductionPlan {
  targetId: string
  targetIpm: number
  supplyCountByItem: Record<string, number>
  supplyCountInventory: Record<string, number>
  isExportable: boolean
  steps: ProductionStep[]
  stats: { buildings: number; power: number; heat: number }
}

export interface BuildProductionPlanParams {
  buildings: Building[]
  targetId: string
  targetIpm: number
  supplyCountByItem: Record<string, number>
  isExportable: boolean
}
