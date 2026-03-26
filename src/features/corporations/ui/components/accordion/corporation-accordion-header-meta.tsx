import type { Corporation } from '@/shared/@types/production'
import { Flex } from '@/shared/ui'
import { formatNumber } from '@/shared/utils'
import { Chip } from '@heroui/react'

export const CorporationHeaderMeta = ({ corporation }: { corporation: Corporation }) => {
  const componentsCount = corporation.levels.reduce((acc, c) => acc + (c.components?.length ?? 0), 0)
  const rewardsCount = corporation.levels.reduce((acc, c) => acc + (c.rewards?.length ?? 0), 0)
  const xpCount = corporation.levels.reduce((total, c) => total + c.xp, 0)

  return (
    <Flex gap="md" align="center" wrap="wrap">
      <Chip>{corporation.levels.length ?? 0} levels</Chip>
      <Chip>{componentsCount} components</Chip>
      <Chip>{rewardsCount} rewards</Chip>
      <Chip>{formatNumber(xpCount)} G</Chip>
    </Flex>
  )
}
