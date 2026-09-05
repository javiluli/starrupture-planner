export interface RecipeInput {
  id: string
  amount_per_minute: number
}

export interface RecipeOutput {
  id: string
  amount_per_minute: number
}

export interface Recipe {
  output: RecipeOutput
  inputs: readonly RecipeInput[]
}

export interface BuildingLevel {
  level: number
  heatCapacity: number
}

export interface RawBuilding {
  id: string
  name: string
  power?: number
  heat?: number
  type: string
  upgrade?: string
  recipes?: readonly Recipe[]
  levels?: readonly BuildingLevel[]
  coreHeatCapacity?: number
}

/** Application model with source omissions normalized once at the data boundary. */
export interface Building extends Omit<RawBuilding, 'heat' | 'power' | 'recipes'> {
  power: number
  heat: number
  recipes: readonly Recipe[]
}

export interface BuildingConstructionArea {
  id: string
  area_ocupada: readonly number[]
  radio_area_construccion?: number
  diametro_area_construccion?: number
  power?: number
  heat?: number
}
