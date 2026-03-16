import { Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { NumberInput } from '@heroui/react'

export function TargetRateInput() {
  const targetIpm = usePlannerStore(plannerSelectors.targetIpm)
  const setTargetIpm = usePlannerStore(plannerSelectors.setTargetIpm)

  return (
    <NumberInput
      size="sm"
      variant="bordered"
      className="max-w-32"
      minValue={0}
      value={targetIpm}
      onValueChange={setTargetIpm}
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
