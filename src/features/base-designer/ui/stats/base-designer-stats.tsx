import { Flex, Typography } from '@/shared/ui'
import { Divider, Tooltip } from '@heroui/react'
import { Factory } from 'lucide-react'
import { useBaseDesignerStats } from '../../hooks/use-base-designer-stats'
import { HeatMeter } from './heat-meter'
import { PowerMeter } from './power-meter'

export const BaseDesignerStats = () => {
  const stats = useBaseDesignerStats()

  return (
    <Flex wrap="wrap" gap="lg">
      <Tooltip content="Buildings placed on the field" showArrow>
        <Flex
          as="span"
          tabIndex={0}
          aria-label={`Buildings placed: ${stats.buildingCount}`}
          className="rounded-sm px-2 outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <Factory aria-hidden size={18} />
          <Typography as="span" className="font-mono tabular-nums">
            {stats.buildingCount}
          </Typography>
        </Flex>
      </Tooltip>
      <Divider orientation="vertical" className="hidden h-8 bg-divider sm:block" />
      <PowerMeter generated={stats.generatedPower} consumed={stats.consumedPower} />
      <Divider orientation="vertical" className="hidden h-8 bg-divider sm:block" />
      <HeatMeter heat={stats.heat} capacity={stats.heatCapacity} />
    </Flex>
  )
}
