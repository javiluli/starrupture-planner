import type { CorporationsById } from '@/shared/@types/corporations.type'
import type { BuildingUnlockInfo } from '@/features/recipes/types'

export const getBuildingUnlockInfo = (corporations: CorporationsById, buildingName: string): BuildingUnlockInfo | null => {
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
