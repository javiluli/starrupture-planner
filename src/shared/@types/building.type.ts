export interface RecipeInput {
  id: string
  amount_per_minute: number
}

export interface RecipeOutput {
  id: string
  amount_per_minute: number
}

export interface Recipe {
  output: RecipeInput
  inputs: RecipeInput[]
}

export interface Building {
  id: string
  name: string
  power: number
  heat: number
  type: string
  recipes: Recipe[]
}
