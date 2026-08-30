import type { CorporationsById } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'

export interface CorporationLevelRequirement {
  corporationId: string
  corporationName: string
  level: number
  xpRequired: number
  pointsPerItem: number
  pointsPerMinute: number
  timeMinutes: number
  totalItemsNeeded: number
}

/** Calculates completion estimates from the corporation levels associated with the selected item. */
export const calculateCorporationLevelRequirements = (
  item: Item,
  targetIpm: number,
  corporations: CorporationsById,
): CorporationLevelRequirement[] => {
  const requirements: CorporationLevelRequirement[] = []

  for (const reference of item.corporations ?? []) {
    const corporation = corporations[reference.corporationName]
    const level = corporation?.levels.find((candidate) => candidate.level === reference.level)
    const component = level?.components.find((candidate) => candidate.id === item.id)

    if (!corporation || !level || !component || level.xp <= 0) continue

    const pointsPerMinute = targetIpm * component.points
    requirements.push({
      corporationId: reference.corporationId,
      corporationName: reference.corporationName,
      level: reference.level,
      xpRequired: level.xp,
      pointsPerItem: component.points,
      pointsPerMinute,
      timeMinutes: pointsPerMinute > 0 ? level.xp / pointsPerMinute : 0,
      totalItemsNeeded: Math.ceil(level.xp / component.points),
    })
  }

  return requirements
}

export const sortRequirementsByTime = (requirements: CorporationLevelRequirement[]) =>
  [...requirements].sort((first, second) => first.timeMinutes - second.timeMinutes)

export const pickRequirementByIndex = (requirements: CorporationLevelRequirement[], index: number) => {
  if (!requirements.length) return { selectedStat: undefined, safeIndex: 0 }
  const safeIndex = index >= requirements.length ? 0 : index
  return { selectedStat: requirements[safeIndex], safeIndex }
}
