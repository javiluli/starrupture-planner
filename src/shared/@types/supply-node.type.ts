export interface SupplyNodeData {
  buildingId: string // ID de la maquina actual donde se va a fabricar
  buildingName: string // Nombre de la maquina
  buildingPower: number // En termino del juego "Energia que condume la maquina"
  buildingHeat: number // En termino del juego "Refrigeracion que consume la maquina del CORE BASE"
  itemId: string // ID del item/objeto "supply"
  itemName: string // Nombre del item/objeto "supply"
  supply: number // Cantidad de items que ya se fabrican desde otro lado, estos se restan del total requerido para ese item
  onSupplyChange: (itemId: string, amount: number) => void // Funcion que actualiza esa cantidad externa de items fabricados (supply)
  [key: string]: unknown
}
