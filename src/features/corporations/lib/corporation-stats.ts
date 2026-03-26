import type { CorporationsData } from '@/shared/@types/production'

interface Props {
  corporations: CorporationsData
}

export const corporationStats = ({ corporations }: Props) => {
  const toArray = Object.values(corporations)
  const levelsCount = toArray.reduce((acc, c) => acc + (c.levels?.length ?? 0), 0)
  const costCount = toArray.reduce((total, c) => total + c.levels.reduce((sum, lvl) => sum + lvl.xp, 0), 0)

  return {
    corporationsCount: toArray.length,
    levelsCount,
    costCount,
  }
}
