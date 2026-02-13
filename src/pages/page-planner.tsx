import {
  PlannerFlowDiagram,
  PlannerItemSelector,
  PlannerMarquee,
  PlannerSidebar,
  PlannerStatsDisplay,
  PlannerTargetIpm,
} from '@/components/planner'
import { usePlannerStore } from '@/store/planner.store'
import { useTranslation } from 'react-i18next'

const PagePlanner = () => {
  const { t } = useTranslation('planner')
  const targetId = usePlannerStore((state) => state.targetId)

  return (
    <div className="h-full flex flex-col">
      {/* Submenu superior */}
      <div className="flex items-center px-6 py-2 space-x-2 border-b-1 border-divider">
        {/* Selector de item */}
        <PlannerItemSelector />
        {/* Cantidad de items/min a generar */}
        <PlannerTargetIpm />
        {/* Stats power/heat del "Core Base" */}
        <PlannerStatsDisplay />
      </div>

      {/* Se muetsra el Flow si hay un items seleccionado */}
      {targetId ? (
        <div className="flex flex-1">
          <div className="flex-1">
            {/* Diagrama principal React Flow */}
            <PlannerFlowDiagram />
          </div>
          {/* Menus/Sidebar para seleccionar items externos que se suman a la produccion (supply) */}
          <PlannerSidebar />
        </div>
      ) : (
        // Si no hay un item seleccioando
        <div className="h-full flex flex-col items-center justify-center space-y-2 text-center">
          <PlannerMarquee />
          <h2>{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </div>
      )}
    </div>
  )
}

export default PagePlanner
