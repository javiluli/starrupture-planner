import { Flex, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Divider, Tooltip } from '@heroui/react'
import { Factory, Flame, Zap } from 'lucide-react'

export const StatsBar: React.FC = () => {
  const stats = usePlannerStore(plannerSelectors.plannerStats)
  const { buildings, power, heat } = stats

  return (
    <Flex className="h-5 px-3" gap="md">
      <Tooltip content={`${buildings} Buildings`}>
        <Flex>
          <Factory size={20} />
          <Typography as="span">{buildings}</Typography>
        </Flex>
      </Tooltip>

      <Divider orientation="vertical" className="bg-foreground/60" />

      <Tooltip content={`${power} power use`}>
        <Flex>
          <Zap size={20} />
          <Typography as="span">{power}</Typography>
        </Flex>
      </Tooltip>
      <Divider orientation="vertical" className="bg-foreground/60" />

      <Tooltip content={`${heat} heat of Core base`}>
        <Flex>
          <Flame size={20} />
          <Typography as="span">{heat}</Typography>
        </Flex>
      </Tooltip>
    </Flex>
  )
}
