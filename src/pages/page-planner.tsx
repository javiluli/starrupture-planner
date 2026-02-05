import {
  PlannerFlowDiagram,
  PlannerItemSelector,
  PlannerMarquee,
  PlannerSidebar,
  PlannerStatsDisplay,
  PlannerTargetIpm,
} from '@/components/planner'
import { usePlannerStore } from '@/store/planner.store'
import { Divider, Switch } from '@heroui/react'
import { useState } from 'react'

const PagePlanner = () => {
  const targetId = usePlannerStore((state) => state.targetId)
  const [isSelected, setIsSelected] = useState(true)

  return (
    <div className="h-full flex flex-col">
      {/* Submenu superior */}
      <div className="flex items-center px-6 py-2 space-x-2">
        {/* Selector de item */}
        <PlannerItemSelector />
        {/* Cantidad de items/min a generar */}
        <PlannerTargetIpm />
        {/* Stats power/heat del "Core Base" */}
        <PlannerStatsDisplay />
        {/* Agrega el "Orbital Export System" al diagrama como final */}
        <Switch size="sm" isDisabled={!targetId} isSelected={isSelected} onValueChange={setIsSelected} defaultSelected>
          Diagram with Orbital Export System
        </Switch>
      </div>

      <Divider />

      {/* Se muetsra el Flow si hay un items seleccionado */}
      {targetId ? (
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Menus/Sidebar para seleccionar items externos que se suman a la produccion (supply) */}
          <PlannerSidebar />
          <div className="flex-1 relative overflow-hidden">
            {/* Diagrama principal React Flow */}
            <PlannerFlowDiagram addOrbitalExportSystem={isSelected} />
          </div>
        </div>
      ) : (
        // Si no hay un item seleccioando
        <div className="h-full flex flex-col items-center justify-center space-y-2 text-center">
          <PlannerMarquee />
          <h2>Selecciona un objeto para empezar la producción</h2>
          <p>Elije cualquier elemento, componente o munición procesados para ver los edificios necesarios y el flujo de recursos.</p>
        </div>
      )}
    </div>
  )
}

export default PagePlanner
