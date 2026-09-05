import type { Building } from '@/shared/@types/building.type'
import type { BaseDesignerStats } from '../types'

const EMPTY_STATS: BaseDesignerStats = {
  buildingCount: 0,
  generatedPower: 0,
  consumedPower: 0,
  powerBalance: 0,
  heat: 0,
  heatCapacity: 1000,
}

/** Calculates base totals from placed building IDs and the immutable game catalog. */
export const calculateBaseDesignerStats = (buildingIds: readonly string[], buildings: readonly Building[]): BaseDesignerStats => {
  if (buildingIds.length === 0) {
    const heatCapacity = buildings.find((building) => building.id === 'base_core')?.levels?.[0]?.heatCapacity
    return { ...EMPTY_STATS, heatCapacity: heatCapacity ?? EMPTY_STATS.heatCapacity }
  }

  const buildingById = new Map(buildings.map((building) => [building.id, building]))
  let generatedPower = 0
  let consumedPower = 0
  let heat = 0

  for (const buildingId of buildingIds) {
    const building = buildingById.get(buildingId)
    if (!building) continue

    const power = Number(building.power) || 0
    heat += Number(building.heat) || 0

    if (building.type === 'generator') generatedPower += power
    else consumedPower += power
  }

  const heatCapacity = buildingById.get('base_core')?.levels?.[0]?.heatCapacity ?? EMPTY_STATS.heatCapacity

  return {
    buildingCount: buildingIds.length,
    generatedPower,
    consumedPower,
    powerBalance: generatedPower - consumedPower,
    heat,
    heatCapacity,
  }
}
