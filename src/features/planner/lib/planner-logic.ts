import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID } from '@/features/planner/constants'
import type { Building, Stats } from '@/shared/@types/production'

export interface ProductionTotalsResult {
  totals: Map<string, number>
  power: number
  heat: number
  buildings: number
}

/**
 * Normaliza el valor de ipm para evitar negativos o NaN.
 *
 * @param value Valor introducido por el usuario
 * @returns Valor clamped a 0 o mas
 */
export const clampTargetIpm = (value: number) => {
  if (Number.isNaN(value)) return 0
  return Math.max(0, value)
}

/**
 * Calcula la demanda neta de produccion y las estadisticas de fabrica.
 *
 * @param buildings Lista de edificios disponibles
 * @param targetId Item objetivo
 * @param targetIpm Produccion objetivo por minuto
 * @param supplies Suministros externos que reducen demanda
 * @param addOrgitalExportSystem Si se agrega exportacion orbital
 * @returns Totales por item y stats globales
 */
export const calculateProductionTotals = (
  buildings: Building[],
  targetId: string,
  targetIpm: number,
  supplies: Record<string, number>,
  addOrgitalExportSystem: boolean,
): ProductionTotalsResult => {
  /**
   * Mapa de demanda neta por item.
   * Nota: se llena de forma recursiva usando las recetas.
   */
  const productionTotals = new Map<string, number>()

  /**
   * Inventario temporal para consumir supply antes de producir.
   * Regla: minimo 1 unidad para cualquier supply activo.
   */
  const runningInventory: Record<string, number> = {}
  Object.keys(supplies).forEach((id) => {
    runningInventory[id] = Math.max(1, supplies[id])
  })

  /**
   * Resuelve la demanda recursiva del item objetivo.
   * Importante: mantener determinismo para que el layout sea estable.
   */
  const requestItems = (id: string, amountNeeded: number) => {
    const available = runningInventory[id] || 0
    const takenFromSupply = Math.min(amountNeeded, available)

    if (runningInventory[id] !== undefined) {
      runningInventory[id] -= takenFromSupply
    }

    const debt = amountNeeded - takenFromSupply

    if (debt > 0) {
      const prevProd = productionTotals.get(id) || 0
      productionTotals.set(id, prevProd + debt)

      const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
      const r = b?.recipes?.find((r) => r.output.id === id)

      if (r) {
        r.inputs.forEach((input) => {
          // Escalado proporcional a la salida de la receta.
          const inputQty = (input.amount_per_minute / r.output.amount_per_minute) * debt
          requestItems(input.id, inputQty)
        })
      }
    }
  }

  requestItems(targetId, targetIpm)

  let power = 0
  let heat = 0
  let totalBuildings = 0

  productionTotals.forEach((qty, id) => {
    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
    const r = b?.recipes?.find((r) => r.output.id === id)
    if (b && r) {
      const count = Math.ceil(qty / r.output.amount_per_minute)
      power += count * (b.power || 0)
      heat += count * (b.heat || 0)
      totalBuildings += count
    }
  })

  // Exportacion orbital suma coste del launcher.
  if (addOrgitalExportSystem) {
    const launcher = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
    const count = Math.ceil(targetIpm / ORBITAL_CARGO_LAUNCHER_EXPORT_IPM)
    power += count * (launcher?.power || 0)
    heat += count * (launcher?.heat || 0)
    totalBuildings += count
  }

  return { totals: productionTotals, power, heat, buildings: totalBuildings }
}

export type FlowStats = Pick<Stats, 'buildings' | 'power' | 'heat'>

export const toFlowStats = ({ buildings, power, heat }: ProductionTotalsResult): FlowStats => ({
  buildings,
  power,
  heat,
})
