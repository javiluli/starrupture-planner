import { BuildingImage } from '@/components/ui/asset-image'
import { useDataStore } from '@/store/data.store'
import { ArrowRightStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Button, cn } from '@heroui/react'
import { useState } from 'react'
import { DragGhost } from '../components/drag-ghost'
import { useCreateBuildingNode } from '../hooks/useCreateBuildingNode'
import { useDnD } from '../hooks/useDnD'

export const Sidebar = () => {
  // Traemos los datos de los edificios del store global
  const buildings = useDataStore((state) => state.buildings)
  // Gestionamos el inicio del arrastre y el estado de "dragging"
  const { onDragStart, isDragging } = useDnD()
  // Lógica extraída para la creación física del nodo en el mapa
  const { createBuildingNode } = useCreateBuildingNode()
  // 'type' se usa para identificar qué edificio estamos arrastrando (Ghost)
  const [type, setType] = useState<string | null>(null)
  // Controla si el panel lateral está expandido o colapsado
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {isDragging && <DragGhost type={type} />}
      <div className={cn('flex flex-col px-4 py-6', isOpen ? 'w-full max-w-sm' : 'min-w-fit')}>
        <div className="flex justify-between mb-6">
          {isOpen && <h3 className="font-bold">Buildings 🏭</h3>}
          <Button isIconOnly size="sm" variant="bordered" onPress={() => setIsOpen(!isOpen)}>
            {isOpen ? <XMarkIcon className="size-5" /> : <ArrowRightStartOnRectangleIcon className="size-5" />}
          </Button>
        </div>

        {isOpen && (
          <div className="pr-3 space-y-1 overflow-y-auto">
            {buildings.map((b) => (
              <div
                key={b.id}
                onPointerDown={(event) => {
                  setType(b.name)
                  onDragStart(event, createBuildingNode(b))
                }}
                className="flex justify-between px-3 py-2 border-2 border-content2 rounded-lg hover:border-primary transition-colors"
              >
                <BuildingImage id={b.id} className="max-h-24" />
                <div className="px-3 py-2 flex flex-col items-end space-y-2">
                  <span className="text-lg font-semibold">{b.name} </span>
                  <div className="flex space-x-2">
                    <div className="px-3 py-1 text-sm border border-[#ffc83d] rounded-xl">{b.power} ⚡</div>
                    <div className="px-3 py-1 text-sm border border-[#f7630c] rounded-xl">{b.heat} 🔥</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
