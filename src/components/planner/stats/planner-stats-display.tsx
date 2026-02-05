import { Divider } from '@heroui/react'
import { usePlannerStore } from '../../../store/planner.store'

export const PlannerStatsDisplay: React.FC = () => {
  const stats = usePlannerStore((state) => state.plannerStats)
  const { buildings, power, heat } = stats

  return (
    <div className="flex h-6 items-center space-x-3">
      <span color="text-foreground">🏭 {buildings}</span>
      <Divider orientation="vertical" className="bg-foreground/50" />
      <span color="text-foreground">⚡ {power}</span>
      <Divider orientation="vertical" className="bg-foreground/50" />
      <span color="text-foreground">🔥 {heat}</span>
    </div>
  )
}
