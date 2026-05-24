import { Flex, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Divider } from '@heroui/react'
import { Factory, Flame, Zap } from 'lucide-react'

export const StatsBar: React.FC = () => {
  const stats = usePlannerStore(plannerSelectors.plannerStats)
  const { buildings, power, heat } = stats

  return (
    <Flex className="h-5 px-3" gap="md">
      <Flex>
        <Factory size={20} />
        <Typography as="span">{buildings}</Typography>
      </Flex>

      <Divider orientation="vertical" className="bg-foreground/60" />

      <Flex>
        <Zap size={20} />
        <Typography as="span">{power}</Typography>
      </Flex>

      <Divider orientation="vertical" className="bg-foreground/60" />

      <Flex>
        <Flame size={20} />
        <Typography as="span">{heat}</Typography>
      </Flex>
    </Flex>
  )
}
