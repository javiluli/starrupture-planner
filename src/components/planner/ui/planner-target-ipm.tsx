import { usePlannerStore } from '@/store/planner.store'
import { NumberInput } from '@heroui/react'

export function PlannerTargetIpm() {
  const targetIpm = usePlannerStore((state) => state.targetIpm)
  const setTargetIpm = usePlannerStore((state) => state.setTargetIpm)

  return (
    <div className="flex gap-1 items-center">
      <NumberInput size="sm" className="max-w-20" minValue={0} value={targetIpm} onValueChange={setTargetIpm} />
      <span className="text-sm">/min</span>
    </div>
  )
}
