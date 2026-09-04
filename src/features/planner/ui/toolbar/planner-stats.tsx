import type { ReactNode } from 'react'
import { Flex, Typography } from '@/shared/ui'
import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'
import { Divider, Tooltip } from '@heroui/react'
import { Factory, Flame, Zap } from 'lucide-react'

interface PlannerStatProps {
  icon: ReactNode
  value: number
  tooltip: string
}

const PlannerStat = ({ icon, value, tooltip }: PlannerStatProps) => (
  <Tooltip content={tooltip} showArrow delay={250} closeDelay={0}>
    <Flex
      as="span"
      tabIndex={0}
      aria-label={`${tooltip}: ${value}`}
      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      {icon}
      <Typography as="span" className="font-mono tabular-nums">
        {value}
      </Typography>
    </Flex>
  </Tooltip>
)

/** Compact summary of the resources required by the active production plan. */
export const PlannerStats = () => {
  const { buildings = 0, power = 0, heat = 0 } = useProductionPlan()?.stats ?? {}

  return (
    <Flex className="h-5 px-3" gap="sm">
      <PlannerStat icon={<Factory aria-hidden size={18} />} value={buildings} tooltip="Production buildings required" />
      <Divider orientation="vertical" className="bg-foreground/60" />
      <PlannerStat icon={<Zap aria-hidden size={18} />} value={power} tooltip="Total power consumption" />
      <Divider orientation="vertical" className="bg-foreground/60" />
      <PlannerStat icon={<Flame aria-hidden size={18} />} value={heat} tooltip="Total heat generated" />
    </Flex>
  )
}
