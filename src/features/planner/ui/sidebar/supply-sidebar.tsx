import { Flex } from '@/shared/ui'
import { getSupplyItemIds } from '@/features/planner/lib/supply'
import { memo } from 'react'
import { SupplyCard } from './supply-card'
import { SupplyModal } from './supply-modal'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
/**
 * React.memo se utiliza aqui por razones de performance criticas:
 * 1. Aislamiento de Renders: Este componente esta suscrito al PlannerStore.
 * Sin memo, cualquier cambio en el canvas de React Flow (como mover un nodo)
 * podria disparar re-renders innecesarios en el Sidebar.
 *
 * 2. Estabilidad de la UI: Al ser un panel con multiples sub-componentes
 * (cards, imagenes, inputs), el memo garantiza que React solo procese
 * los cambios si los datos de suministros (supplies) han variado realmente.
 *
 * 3. Fluidez del Diagrama: Mantiene el hilo principal libre de carga visual
 * pesada mientras el motor de React Flow realiza calculos de posicionamiento.
 */

/**
 * Componente que lista todos los recursos de la cadena actual.
 * Utiliza React.memo para evitar re-renderizados pesados durante el arrastre de nodos.
 */
export const SupplySidebar = memo(() => {
  // Filtramos solo nodos de produccion, es decir, que produzcan algo
  const supplies = usePlannerStore(plannerSelectors.supplies)

  return (
    <Flex direction="col" align="stretch" className="p-4 panel overflow-hidden">
      <SupplyModal />
      <Flex direction="col" gap="md" className="flex-1 pr-3 overflow-y-auto">
        {getSupplyItemIds(supplies).map((id) => (
          <SupplyCard key={id} itemId={id} value={supplies[id]} />
        ))}
      </Flex>
    </Flex>
  )
})
