import type { Corporation } from '@/shared/@types/corporations.type'
import { Flex } from '@/shared/ui'
import { formatNumber } from '@/shared/utils'
import { Chip } from '@heroui/react'

export const CorporationAccordionMeta = ({ corporation }: { corporation: Corporation }) => {
  const componentsCount = corporation.levels.reduce((acc, c) => acc + (c.components?.length ?? 0), 0)
  const rewardsCount = corporation.levels.reduce((acc, c) => acc + (c.rewards?.length ?? 0), 0)
  const xpCount = corporation.levels.reduce((total, c) => total + c.xp, 0)

  return (
    <Flex gap="sm" align="center" wrap="wrap">
      <Chip size="sm">{corporation.levels.length ?? 0} levels</Chip>
      <Chip size="sm">{componentsCount} components</Chip>
      <Chip size="sm">{rewardsCount} rewards</Chip>
      <Chip size="sm">{formatNumber(xpCount)} G</Chip>
    </Flex>
  )
}
