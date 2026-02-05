import { PlannerStatsDisplay } from '@/components/planner/stats/planner-stats-display'
import { PlannerItemSelector, PlannerMarquee, PlannerTargetIpm } from '@/components/planner/ui'
import { PlannerFlowDiagram } from '@/components/planner/visualization/planner-flow-diagram'
import { ItemImage } from '@/components/ui/asset-image'
import { usePlannerStore } from '@/store/planner.store'
import { Divider, Link, Switch } from '@heroui/react'
import { ReactFlowProvider } from '@xyflow/react'
import { useMemo, useState } from 'react'

function getRandomItems(array: string[], count = 16) {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const PagePlanner = () => {
  const items = usePlannerStore((state) => state.items)
  const targetId = usePlannerStore((state) => state.targetId)
  const setTargetId = usePlannerStore((state) => state.setTargetId)

  const [isSelected, setIsSelected] = useState(true)

  //  Generamos la lista aleatoria de IDs de forma segura
  const itemList = useMemo(() => {
    const ids = items.map((i) => i.id)
    return getRandomItems(ids)
  }, [items])

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-2 space-y-2">
        <div className="flex items-center space-x-4">
          <PlannerItemSelector />
          <PlannerTargetIpm />
          <PlannerStatsDisplay />
          <Switch size="sm" isDisabled={!targetId} isSelected={isSelected} onValueChange={setIsSelected} defaultSelected>
            Diagram with Orbital Export System
          </Switch>
        </div>
      </div>

      <Divider />

      {/* Flow items */}
      {targetId ? (
        <ReactFlowProvider>
          <PlannerFlowDiagram addOrbitalExportSystem={isSelected} />
        </ReactFlowProvider>
      ) : (
        <div className="h-full flex flex-col items-center justify-center space-y-2 text-center">
          <PlannerMarquee animationDuration={90}>
            {itemList.map((id, idx) => (
              <div key={`$${id}-${idx}`} className="flex w-28 shrink-0 items-center justify-center hover:cursor-pointer">
                <Link
                  onPress={() => {
                    setTargetId(id)
                  }}
                >
                  <ItemImage id={id} className="w-full h-24" />
                </Link>
              </div>
            ))}
          </PlannerMarquee>
          <h2>Selecciona un objeto para empezar la producción</h2>
          <p>Elije cualquier elemento, componente o munición procesados para ver los edificios necesarios y el flujo de recursos.</p>
        </div>
      )}
    </div>
  )
}

export default PagePlanner
