import type { CorporationsData } from '@/shared/@types/production'

export interface BuildingUnlockInfo {
  corporationId: string
  corporationName: string
  level: number
}

const normalize = (value: string) => value.trim().toLowerCase()

export const buildBuildingUnlockMap = (corporations: CorporationsData) => {
  const map = new Map<string, BuildingUnlockInfo>()

  Object.entries(corporations).forEach(([corporationName, corporation]) => {
    corporation.levels.forEach((level) => {
      level.rewards?.forEach((reward) => {
        const key = normalize(reward.name)
        if (!key || map.has(key)) return

        map.set(key, {
          corporationId: corporation.id,
          corporationName,
          level: level.level,
        })
      })
    })
  })

  return map
}

export const getBuildingUnlockInfo = (unlockMap: Map<string, BuildingUnlockInfo>, buildingName: string) =>
  unlockMap.get(normalize(buildingName)) ?? null
