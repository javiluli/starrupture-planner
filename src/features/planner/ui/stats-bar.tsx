import { Flex, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Divider } from '@heroui/react'
import { Factory, Flame, Zap } from 'lucide-react'

export const StatsBar: React.FC = () => {
  const stats = usePlannerStore(plannerSelectors.plannerStats)
  const { buildings, power, heat } = stats

  return (
    <Flex className="h-8 px-3 panel" gap="md">
      <Flex gap="xs" className="text-foreground/70">
        <Factory className="h-4 w-4" />
        <Typography as="span" variant="small" tone="normal">
          {buildings}
        </Typography>
      </Flex>

      <Divider orientation="vertical" className="bg-divider/60" />

      <Flex gap="xs" className="text-foreground/70">
        <Zap className="h-4 w-4" />
        <Typography as="span" variant="small" tone="normal">
          {power}
        </Typography>
      </Flex>

      <Divider orientation="vertical" className="bg-divider/60" />

      <Flex gap="xs" className="text-foreground/70">
        <Flame className="h-4 w-4" />
        <Typography as="span" variant="small" tone="normal">
          {heat}
        </Typography>
      </Flex>
    </Flex>
  )
}
