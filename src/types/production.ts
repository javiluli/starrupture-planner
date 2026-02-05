export interface RecipeInput {
  id: string
  amount_per_minute: number
}

export interface Recipe {
  output: {
    id: string
    amount_per_minute: number
  }
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

export type ItemType = 'raw' | 'processed' | 'component' | 'material' | 'ammo'

export interface Item {
  id: string
  name: string
  type: ItemType
}

export interface ProductionNodeData {
  buildingId: string // ID de la maquina actual donde se va a fabricar
  buildingName: string // Nombre de la maquina
  buildingPower: number // En termino del juego "Energia que condume la maquina"
  buildingHeat: number // En termino del juego "Refrigeracion que consume la maquina del CORE BASE"
  buildingLoad: number // Cantidad de maquinas exactas o carga exacta de trabajo (Ej: 1.24 maquinas, 1 maquina y "0.24 de una segunda maquina")
  buildingCount: number //Cantidad redonde de maquinas necesarias a colocar (si "buildingLoad" es 1.24, este valor sera 2, redonde hacia arriba)

  itemId: string // ID del item/objeto que va a fabricar la maquina
  itemName: string // Nombre del item/objeto

  baseIpm: number // Fijo: Lo que produce 1 sola máquina (ej: 60)
  targetIpm: number // Variable: Lo que el sistema REQUIERE (ej: 75)

  supply: number // Cantidad de items que ya se fabrican desde otro lado, estos se restan del total requerido para ese item
  onSupplyChange: (itemId: string, amount: number) => void // Funcion que actualiza esa cantidad externa de items fabricados (supply)

  [key: string]: unknown
}

export interface OrbitalExportSystemNodeData {
  buildingPower: number // En termino del juego "Energia que condume la maquina"
  buildingHeat: number // En termino del juego "Refrigeracion que consume la maquina del CORE BASE"
  buildingCount: number //Cantidad redonde de maquinas necesarias a colocar (si "buildingLoad" es 1.24, este valor sera 2, redonde hacia arriba)

  exportItemId: string
  exportItemName: string

  [key: string]: unknown
}

export interface Stats {
  buildings: number
  power: number
  heat: number
}

/**
 * Corporations
 */
export interface Reward {
  name: string
}

export interface Component {
  id: string
  points: number
}

export interface Level {
  level: number
  xp: number
  components: Component[]
  rewards: Reward[]
}

export interface Corporation {
  id: string
  description: string
  levels: Level[]
}

// El tipo global para tu JSON
export interface CorporationsData {
  [corporationName: string]: Corporation
}

export interface CorporationLevelMatch {
  corporationId: string
  level: number
}
