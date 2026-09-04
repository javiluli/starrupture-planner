import { Flex, Typography } from '@/shared/ui'
import { Progress } from '@heroui/react'
import { Zap } from 'lucide-react'

interface PowerMeterProps {
  generated: number
  consumed: number
}

export const PowerMeter = ({ generated, consumed }: PowerMeterProps) => {
  const isOverCapacity = consumed > generated

  return (
    <Flex direction="col" align="stretch" gap="xs" className="min-w-48">
      <Flex justify="between" gap="md">
        <Flex as="span" gap="xs">
          <Zap aria-hidden size={16} className="text-warning" />
          <Typography as="span" variant="small" tone="soft">
            Power
          </Typography>
        </Flex>
        <Typography as="span" variant="small" className="font-mono tabular-nums">
          {consumed} / {generated}
        </Typography>
      </Flex>
      <Progress
        aria-label="Power consumption"
        size="sm"
        color={isOverCapacity ? 'danger' : 'warning'}
        value={consumed}
        maxValue={Math.max(generated, 1)}
      />
    </Flex>
  )
}
