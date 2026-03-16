/**
 * Crea un inventario temporal para consumir supply antes de producir.
 *
 * Regla: minimo 1 unidad para cualquier supply activo.
 *
 * @param supplies Mapa de supply (id -> cantidad).
 * @returns Inventario clon con valores normalizados.
 */
export const buildSupplyInventory = (supplies: Record<string, number>) => {
  const inventory: Record<string, number> = {}
  Object.keys(supplies).forEach((id) => {
    inventory[id] = Math.max(1, supplies[id])
  })
  return inventory
}
