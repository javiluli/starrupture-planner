import { usePlannerTarget } from '@/features/planner'
import { Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { NumberInput } from '@heroui/react'

export const TargetRateInput = () => {
  const targetIpm = usePlannerStore(plannerSelectors.targetIpm)
  const { setTargetRate } = usePlannerTarget()

  return (
    <NumberInput
      size="sm"
      variant="bordered"
      className="max-w-32"
      minValue={0}
      value={targetIpm}
      onValueChange={setTargetRate}
      endContent={
        <div className="pointer-events-none flex items-center">
          <Typography as="span" variant="micro" tone="soft">
            /
          </Typography>
          <Typography as="span" variant="micro" tone="soft">
            min
          </Typography>
        </div>
      }
    />
  )
}
