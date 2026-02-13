import { useSketchStore } from '@/store/sketch.store'
import { HeatStat } from './heat-stat'
import { PowerStat } from './power-stat'

export const SketchStatsDisplay = () => {
  const plannerStats = useSketchStore((state) => state.plannerStats)

  return (
    <div className="flex items-center space-x-2">
      <PowerStat maxPower={plannerStats.maxPower} restPower={plannerStats.restPower} />
      <HeatStat heat={plannerStats.heat} />
    </div>
  )
}
