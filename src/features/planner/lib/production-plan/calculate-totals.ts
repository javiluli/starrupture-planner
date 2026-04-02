import type { Building } from '@/shared/@types/building.type'
import { findRecipeForItem } from '../recipes'

/**
 * Crea un inventario temporal a partir del supply.
 * Regla: minimo 1 unidad para cualquier supply activo.
 *
 * @param supplyCountByItem Supply externo por item.
 * @returns Inventario clonado con minimo 1 unidad por item supply.
 */
export const buildSupplyCountInventory = (supplyCountByItem: Record<string, number>) => {
  const inventory: Record<string, number> = {}

  Object.keys(supplyCountByItem).forEach((id) => {
    inventory[id] = Math.max(1, supplyCountByItem[id])
  })

  return inventory
}

/**
 * Calcula la demanda neta por item resolviendo recetas de forma recursiva.
 * Nota: el supply se consume antes de generar demanda nueva.
 *
 * @param buildings Catalogo de edificios.
 * @param targetId Item objetivo.
 * @param targetIpm Produccion objetivo por minuto.
 * @param supplyCountByItem Supply externo por item.
 * @returns Mapa itemId -> ipm requerido (neto).
 */
export const calculateTotals = (
  buildings: Building[],
  targetId: string,
  targetIpm: number,
  supplyCountByItem: Record<string, number>,
) => {
  const totals = new Map<string, number>()
  const runningInventory = buildSupplyCountInventory(supplyCountByItem)

  /**
   * Resuelve recursivamente la demanda del item actual.
   * 1) Consume supply disponible.
   * 2) Si falta, acumula deuda en `totals`.
   * 3) Propaga la deuda a los inputs de la receta.
   */
  const requestItems = (id: string, amountNeeded: number) => {
    const available = runningInventory[id] || 0
    const takenFromSupply = Math.min(amountNeeded, available)

    if (runningInventory[id] !== undefined) {
      runningInventory[id] -= takenFromSupply
    }

    const debt = amountNeeded - takenFromSupply

    if (debt > 0) {
      const prevProd = totals.get(id) || 0
      totals.set(id, prevProd + debt)

      const { recipe } = findRecipeForItem(buildings, id)
      if (recipe) {
        recipe.inputs.forEach((input) => {
          const inputQty = (input.amount_per_minute / recipe.output.amount_per_minute) * debt
          requestItems(input.id, inputQty)
        })
      }
    }
  }

  if (targetId && targetIpm > 0) {
    requestItems(targetId, targetIpm)
  }

  return totals
}
