import type { Building } from '@/shared/@types/building.type'
import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID } from '@/features/planner/constants'
import type { BuildProductionPlanParams, ProductionPlan, ProductionStep } from './types'
import { buildSteps } from './build-steps'
import { buildSupplyCountInventory, calculateTotals } from './calculate-totals'

/**
 * Calcula stats globales a partir de los pasos.
 * Suma tambien el launcher orbital si aplica.
 *
 * @param buildings Catalogo de edificios.
 * @param steps Pasos de produccion.
 * @param targetIpm Produccion objetivo por minuto.
 * @param isExportable Indica si se agrega el launcher orbital.
 * @returns Totales de edificios, energia y heat.
 */
const computeStats = (
  buildings: Building[],
  steps: ProductionStep[],
  targetIpm: number,
  isExportable: boolean,
) => {
  let power = 0
  let heat = 0
  let totalBuildings = 0

  steps.forEach((step) => {
    power += step.buildingCount * (step.buildingPower || 0)
    heat += step.buildingCount * (step.buildingHeat || 0)
    totalBuildings += step.buildingCount
  })

  if (isExportable) {
    const launcher = buildings.find((b) => b.id === ORBITAL_CARGO_LAUNCHER_ID)
    const count = Math.ceil(targetIpm / ORBITAL_CARGO_LAUNCHER_EXPORT_IPM)
    power += count * (launcher?.power || 0)
    heat += count * (launcher?.heat || 0)
    totalBuildings += count
  }

  return { buildings: totalBuildings, power, heat }
}

/**
 * Construye el plan completo de produccion.
 * Devuelve pasos, stats y supply ya normalizado.
 *
 * @param params Datos necesarios para calcular el plan.
 * @returns Plan listo para ser transformado en flow o cualquier otra vista.
 */
export const buildProductionPlan = ({
  buildings,
  targetId,
  targetIpm,
  supplyCountByItem,
  isExportable,
}: BuildProductionPlanParams): ProductionPlan => {
  const totals = calculateTotals(buildings, targetId, targetIpm, supplyCountByItem)
  const steps = buildSteps(buildings, totals, supplyCountByItem)
  const supplyCountInventory = buildSupplyCountInventory(supplyCountByItem)

  return {
    targetId,
    targetIpm,
    supplyCountByItem,
    supplyCountInventory,
    isExportable,
    steps,
    stats: computeStats(buildings, steps, targetIpm, isExportable),
  }
}
