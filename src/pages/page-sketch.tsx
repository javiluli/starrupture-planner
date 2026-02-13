import { DnDProvider } from '@/components/sketch/context/DnDContext'
import { SketchStatsDisplay } from '@/components/sketch/stats/sketch-stats-display'
import { Sidebar } from '@/components/sketch/ui/sidebar'
import FactoryBuildingsDiagram from '@/components/sketch/visualization/sketch-diagram'
import { Divider } from '@heroui/react'
import { ReactFlowProvider } from '@xyflow/react'

const PageSketch = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-2 space-y-2">
        <div className="flex items-center justify-center space-x-4">
          <SketchStatsDisplay />
        </div>
      </div>

      <Divider />

      <div className="flex flex-1 w-full overflow-hidden">
        <ReactFlowProvider>
          <DnDProvider>
            <Sidebar />
            <div className="flex-1 relative overflow-hidden">
              <FactoryBuildingsDiagram />
            </div>
          </DnDProvider>
        </ReactFlowProvider>
      </div>
    </div>
  )
}

export default PageSketch
