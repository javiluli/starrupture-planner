import type { Building } from '@/types/production'
import BUILDINGS_DATA from '@/data/buildings_and_recipes.json'

const buildings = BUILDINGS_DATA as Building[]

export const calculateProductionTotals = (
  targetId: string,
  targetIpm: number,
  supplies: Record<string, number>,
  addOrgitalExportSystem: boolean,
) => {
  const totals = new Map<string, number>()

  /**
   * LA LISTA DE LA COMPRA (Recursiva):
   * Mira qué necesitas, y luego mira qué ingredientes necesitan esos ingredientes.
   */
  const calculateNetAmounts = (id: string, amount: number) => {
    // 1. Apuntamos en la lista: "Necesito esta cantidad total de este ítem"
    const prev = totals.get(id) || 0
    totals.set(id, prev + amount)

    // 2. CÁLCULO DE DEMANDA NETA:
    // Restamos lo que viene de fuera.
    const supplyAmount = supplies[id] || 0
    const netNeededForIngredients = Math.max(0, amount - supplyAmount)

    // Si ya no me falta nada por fabricar de esto, dejo de mirar sus ingredientes.
    // ¡Aquí es donde se cortan las ramas del árbol!
    if (netNeededForIngredients <= 0) return

    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
    const r = b?.recipes?.find((r) => r.output.id === id)

    if (r) {
      r.inputs.forEach((input) => {
        // Pedimos a los "hijos" solo lo que nos falta por cubrir
        const inputQty = (input.amount_per_minute / r.output.amount_per_minute) * netNeededForIngredients
        calculateNetAmounts(input.id, inputQty)
      })
    }
  }

  // Empezamos a calcular desde el producto final que elegiste
  calculateNetAmounts(targetId, targetIpm)

  // PASO 2: CONTAR LAS FACTURAS (Luz y Calor)
  let power = 0
  let heat = 0
  let totalBuildings = 0

  totals.forEach((qty, id) => {
    // Para pagar la luz, solo contamos las máquinas que REALMENTE vamos a construir
    const netQtyForStats = Math.max(0, qty - (supplies[id] || 0))

    // Si lo traes todo de fuera, no gastas luz aquí
    if (netQtyForStats <= 0) return

    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
    const r = b?.recipes?.find((r) => r.output.id === id)

    if (b && r) {
      // Redondeamos hacia arriba (no puedes construir media máquina)
      const count = Math.ceil(netQtyForStats / r.output.amount_per_minute)

      power += count * (b.power || 0)
      heat += count * (b.heat || 0)
      totalBuildings += count
    }
  })

  // PASO 3: EL COHETE (Si está activado)
  const launcher = buildings.find((b) => b.id === 'orbital_cargo_launcher')
  if (launcher && addOrgitalExportSystem) {
    const LAUNCHER_CAPACITY = 10
    const launcherCount = Math.ceil(targetIpm / LAUNCHER_CAPACITY)

    power += launcherCount * (launcher.power || 0)
    heat += launcherCount * (launcher.heat || 0)
    totalBuildings += launcherCount
  }

  return { totals, power, heat, buildings: totalBuildings }
}
