import type { CorporationsByName } from '@/shared/@types/corporations.type'
import type { BuildingUnlockInfo } from '../types/recipes.types'

export const getBuildingUnlockInfo = (corporations: CorporationsByName, buildingName: string): BuildingUnlockInfo | null => {
  for (const [corporationName, corporation] of Object.entries(corporations)) {
    for (const level of corporation.levels) {
      if (level.rewards.some((reward) => reward.name === buildingName)) {
        return {
          corporationId: corporation.id,
          corporationLevel: level.level,
          corporationName,
        }
      }
    }
  }

  return null
}
