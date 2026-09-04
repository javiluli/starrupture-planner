import { Flex, Typography } from '@/shared/ui'
import { Progress } from '@heroui/react'
import { Flame } from 'lucide-react'

interface HeatMeterProps {
  heat: number
  capacity: number
}

export const HeatMeter = ({ heat, capacity }: HeatMeterProps) => {
  const isOverCapacity = heat > capacity

  return (
    <Flex direction="col" align="stretch" gap="xs" className="min-w-48">
      <Flex justify="between" gap="md">
        <Flex as="span" gap="xs">
          <Flame aria-hidden size={16} className="text-danger" />
          <Typography as="span" variant="small" tone="soft">
            Heat
          </Typography>
        </Flex>
        <Typography as="span" variant="small" className="font-mono tabular-nums">
          {heat} / {capacity}
        </Typography>
      </Flex>
      <Progress
        aria-label="Base heat"
        size="sm"
        color={isOverCapacity ? 'danger' : 'primary'}
        value={heat}
        maxValue={Math.max(capacity, 1)}
      />
    </Flex>
  )
}
