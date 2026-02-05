import { ItemImage } from '@/components/ui/asset-image'
import { usePlannerStore } from '@/store/planner.store'
import { ArrowRightStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Button, Card, CardBody, CardFooter, cn, Divider, NumberInput } from '@heroui/react'
import { XIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { SidebarModal } from './sidebar-modal'

/**
 * Componente que lista todos los recursos de la cadena actual.
 * Utiliza React.memo para evitar re-renderizados pesados durante el arrastre de nodos.
 */
export const PlannerSidebar = memo(() => {
  // Controla si el panel lateral está expandido o colapsado
  const [isOpen, setIsOpen] = useState(true)
  // Filtramos solo nodos de produccion, es decir, que produzcan algo
  const { items, supplies, addSupplyNode, removeSupply, updateSupply } = usePlannerStore()

  return (
    <div className={cn('flex flex-col px-4 py-6', isOpen ? 'w-full max-w-xs' : 'min-w-fit')}>
      <div className="flex justify-between mb-6">
        {isOpen && (
          <div>
            <h3 className="font-bold mb-1.5">Logistics Overview</h3>
            <p className="text-[10px] text-default-500 uppercase tracking-tighter">Manage external supplies</p>
          </div>
        )}
        <Button isIconOnly size="sm" variant="bordered" onPress={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="size-5" /> : <ArrowRightStartOnRectangleIcon className="size-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <SidebarModal items={items} addSupplyNode={addSupplyNode} />

          <Divider />

          <div className="h-full pr-3 space-y-3 overflow-y-auto">
            {Object.keys(supplies).map((id) => (
              <Card key={id} shadow="md" className="flex-row">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <ItemImage id={id} className="w-full max-h-20" />
                    <NumberInput
                      hideStepper
                      size="sm"
                      label={items.find((i) => i.id === id)?.name || id}
                      labelPlacement="outside-top"
                      minValue={0}
                      onChange={(e) => updateSupply(id, typeof e === 'number' ? e : Number(e.target.value))}
                    />
                  </div>
                </CardBody>

                <CardFooter className="w-fit">
                  <Button isIconOnly variant="light" onPress={() => removeSupply(id)}>
                    <XIcon className="text-danger" size={24} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
