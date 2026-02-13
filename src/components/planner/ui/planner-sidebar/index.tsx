import { usePlannerStore } from '@/store/planner.store'
import { ArrowLeftStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Button, cn, Divider } from '@heroui/react'
import { memo, useState } from 'react'
import { SidebarCardItemSupply } from './sidebar-card-item-supply'
import { SidebarModalItemSupply } from './sidebar-modal-item-supply'
/**
 * React.memo se utiliza aqui por razones de performance criticas:
 * * 1. Aislamiento de Renders: Este componente esta suscrito al PlannerStore.
 * Sin memo, cualquier cambio en el canvas de React Flow (como mover un nodo)
 * podria disparar re-renders innecesarios en el Sidebar.
 * * 2. Estabilidad de la UI: Al ser un panel con multiples sub-componentes
 * (cards, imagenes, inputs), el memo garantiza que React solo procese
 * los cambios si los datos de suministros (supplies) han variado realmente.
 * * 3. Fluidez del Diagrama: Mantiene el hilo principal libre de carga visual
 * pesada mientras el motor de React Flow realiza calculos de posicionamiento.
 */

/**
 * Componente que lista todos los recursos de la cadena actual.
 * Utiliza React.memo para evitar re-renderizados pesados durante el arrastre de nodos.
 */
export const PlannerSidebar = memo(() => {
  // Controla si el panel lateral está expandido o colapsado
  const [isOpen, setIsOpen] = useState(false)
  // Filtramos solo nodos de produccion, es decir, que produzcan algo
  const supplies = usePlannerStore((state) => state.supplies)
  const removeSupply = usePlannerStore((state) => state.removeSupply)
  const updateSupply = usePlannerStore((state) => state.updateSupply)

  return (
    <div className={cn('flex flex-col px-4 py-6 transition-all duration-300 ease-in-out overflow-hidden', isOpen ? 'w-xs' : 'w-16')}>
      <div className="flex justify-between mb-6">
        {isOpen && (
          <div>
            <h3 className="font-bold mb-1.5">Logistics Overview</h3>
            <p className="text-[10px] text-default-500 uppercase tracking-tighter">Manage external supplies</p>
          </div>
        )}
        <Button isIconOnly size="sm" variant="bordered" className={cn(!isOpen && 'mx-auto')} onPress={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="size-5" /> : <ArrowLeftStartOnRectangleIcon className="size-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <SidebarModalItemSupply />

          <Divider />

          <div className="h-full pr-4 py-3 space-y-3 overflow-y-auto">
            {Object.keys(supplies).map((id) => (
              <SidebarCardItemSupply key={id} itemId={id} value={supplies[id]} updateSupply={updateSupply} removeSupply={removeSupply} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
