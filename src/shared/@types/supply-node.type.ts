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
