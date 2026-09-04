export interface ProductionNodeData {
  buildingId: string // ID de la maquina actual donde se va a fabricar
  buildingName: string // Nombre de la maquina
  buildingPower: number // En termino del juego "Energia que condume la maquina"
  buildingHeat: number // En termino del juego "Refrigeracion que consume la maquina del CORE BASE"
  buildingLoad: number // Cantidad de maquinas exactas o carga exacta de trabajo (Ej: 1.24 maquinas, 1 maquina y "0.24 de una segunda maquina")
  buildingCount: number //Cantidad redonde de maquinas necesarias a colocar (si "buildingLoad" es 1.24, este valor sera 2, redonde hacia arriba)

  itemId: string // ID del item/objeto que va a fabricar la maquina
  itemName: string // Nombre del item/objeto

  baseIpm: number // Fijo: Lo que produce 1 sola maquina (ej: 60)
  targetIpm: number // Variable: Lo que el sistema REQUIERE (ej: 75)

  supplyCount: number // Cantidad de items ya fabricados externamente, se restan del total requerido
  onSupplyCountChange: (itemId: string, amount: number) => void // Funcion que actualiza esa cantidad externa de items

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

export interface SupplyNodeData {
  buildingId: string // ID de la maquina actual donde se va a fabricar
  buildingName: string // Nombre de la maquina
  buildingPower: number // En termino del juego "Energia que condume la maquina"
  buildingHeat: number // En termino del juego "Refrigeracion que consume la maquina del CORE BASE"
  itemId: string // ID del item/objeto "supply"
  itemName: string // Nombre del item/objeto "supply"
  supplyCount: number // Cantidad de items ya fabricados externamente, se restan del total requerido
  onSupplyCountChange: (itemId: string, amount: number) => void // Funcion que actualiza esa cantidad externa de items
  [key: string]: unknown
}
