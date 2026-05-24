import type { CorporationLevelRequirement } from '@/shared/utils'

export const sortRequirementsByTime = (requirements: CorporationLevelRequirement[]) =>
  [...requirements].sort((a, b) => a.timeMinutes - b.timeMinutes)

export const pickRequirementByIndex = (requirements: CorporationLevelRequirement[], index: number) => {
  if (!requirements.length) return { selectedStat: undefined, safeIndex: 0 }
  const safeIndex = index >= requirements.length ? 0 : index
  return { selectedStat: requirements[safeIndex], safeIndex }
}
