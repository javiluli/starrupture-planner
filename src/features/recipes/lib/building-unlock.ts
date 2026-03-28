import type { CorporationsById } from '@/shared/@types/corporations.type'
import type { BuildingUnlockInfo } from '@/features/recipes/types'

export const buildBuildingUnlockMap = (corporations: CorporationsById) => {
  const map = new Map<string, BuildingUnlockInfo>()

  Object.entries(corporations).forEach(([corporationName, corporation]) => {
    corporation.levels.forEach((level) => {
      level.components.forEach((component) => {
        if (!map.has(component.id)) {
          map.set(component.id, {
            corporationId: corporation.id,
            corporationLevel: level.level,
            corporationName,
          })
        }
      })
    })
  })

  return map
}

export const getBuildingUnlockInfo = (unlockMap: Map<string, BuildingUnlockInfo>, buildingName: string) => unlockMap.get(buildingName) ?? null
