import { Tab, Tabs } from '@heroui/react'
import { memo } from 'react'
import { BuildingVariantsPanel } from './building-variants-panel'
import { SupplyPanel } from './supply-panel'
/**
 * React.memo se utiliza aqui por razones de performance criticas:
 * 1. Aislamiento de Renders: Este componente esta suscrito al PlannerStore.
 * Sin memo, cualquier cambio en el canvas de React Flow (como mover un nodo)
 * podria disparar re-renders innecesarios en el Sidebar.
 *
 * 2. Estabilidad de la UI: Al ser un panel con multiples sub-componentes
 * (cards, imagenes, inputs), el memo garantiza que React solo procese
 * los cambios si los datos de suministros (supplyCountByItem) han variado realmente.
 *
 * 3. Fluidez del Diagrama: Mantiene el hilo principal libre de carga visual
 * pesada mientras el motor de React Flow realiza calculos de posicionamiento.
 */

/**
 * Componente que lista todos los recursos de la cadena actual.
 * Utiliza React.memo para evitar re-renderizados pesados durante el arrastre de nodos.
 */
export const SidebarPanel = memo(() => {
  return (
    <Tabs
      placement="top"
      variant="underlined"
      aria-label="Supply sidebar"
      fullWidth
      classNames={{
        tabWrapper: 'flex h-full min-h-0 w-full flex-col overflow-hidden',
        base: 'w-full shrink-0',
        tabList: 'w-full',
        panel: 'min-h-0 flex-1 overflow-hidden p-0',
      }}
    >
      <Tab key="supply" title="Supply">
        <SupplyPanel />
      </Tab>

      <Tab key="variants" title="Variants">
        <BuildingVariantsPanel />
      </Tab>
    </Tabs>
  )
})
