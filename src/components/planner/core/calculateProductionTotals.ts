import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID } from '@/constants/planner'
import type { Building } from '@/types/production'

/**
 * MOTOR DE CALCULO DE DEMANDA NETA
 * * Este modulo gestiona la recursion de la cadena de suministro.
 * Prioriza el uso de inventario existente (supplies) antes de asignar carga a maquinas.
 */
export const calculateProductionTotals = (
  buildings: Building[],
  targetId: string,
  targetIpm: number,
  supplies: Record<string, number>,
  addOrgitalExportSystem: boolean,
) => {
  // Almacena la produccion que las fabricas deben asumir obligatoriamente
  const productionTotals = new Map<string, number>()

  // Clon de inventario para gestion de consumo secuencial
  // Se garantiza un minimo de 1 unidad para cualquier supply activo
  const runningInventory: Record<string, number> = {}
  Object.keys(supplies).forEach((id) => {
    runningInventory[id] = Math.max(1, supplies[id])
  })

  /**
   * RESOLUCION DE DEMANDA POR ITEM
   * 1. Determina disponibilidad en inventario.
   * 2. Calcula excedente no cubierto (deuda).
   * 3. Si existe deuda, escala la produccion y solicita ingredientes de forma recursiva.
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
          // El calculo de ingredientes se basa exclusivamente en la produccion neta
          const inputQty = (input.amount_per_minute / r.output.amount_per_minute) * debt
          requestItems(input.id, inputQty)
        })
      }
    }
  }

  requestItems(targetId, targetIpm)

  // CALCULO DE METRICAS OPERATIVAS (ENERGIA, CALOR Y UNIDADES)
  let power = 0,
    heat = 0,
    totalBuildings = 0

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

  if (addOrgitalExportSystem) {
    const launcher = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
    const count = Math.ceil(targetIpm / ORBITAL_CARGO_LAUNCHER_EXPORT_IPM)
    power += count * (launcher?.power || 0)
    heat += count * (launcher?.heat || 0)
    totalBuildings += count
  }

  return { totals: productionTotals, power, heat, buildings: totalBuildings }
}
