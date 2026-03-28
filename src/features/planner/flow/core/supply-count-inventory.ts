/**
 * Crea un inventario temporal para consumir supply antes de producir.
 *
 * Regla: minimo 1 unidad para cualquier supply activo.
 *
 * @param supplyCountByItem Mapa de supply (id -> cantidad).
 */
export const buildSupplyCountInventory = (supplyCountByItem: Record<string, number>) => {
  const inventory: Record<string, number> = {}

  Object.keys(supplyCountByItem).forEach((id) => {
    inventory[id] = Math.max(1, supplyCountByItem[id])
  })

  return inventory
}
