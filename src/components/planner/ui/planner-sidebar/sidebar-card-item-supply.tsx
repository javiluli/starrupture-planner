import { ItemImage } from '@/components/ui/asset-image'
import { Button, Card, CardBody, CardFooter, NumberInput } from '@heroui/react'
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react'
import { memo } from 'react'

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

interface SupplyCardProps {
  itemId: string
  value: number
  updateSupply: (id: string, val: number) => void
  removeSupply: (id: string) => void
}

/**
 * Componetne <Card/> que permie editar la cantidad de items "supply" seleccionado
 * Este muestra la imagen del item,
 * un input para valor concreto junto a dos botones que suman o restan 10 items de golpe
 * y un boton para elinar el item "supply"
 *
 * @param itemId ID del item al que se le suma un "supply"
 * @param value Cantidad de la suma "supply"
 * @param updateSupply Funcion que actualiza el valor
 * @param removeSupply Funcion que elmina el item supply
 */
export const SidebarCardItemSupply = memo(({ itemId, value, updateSupply, removeSupply }: SupplyCardProps) => {
  // Aplica la cantidad de input a la cantidad de items supply
  const handleUpdateSupply = (val: number) => {
    if (isNaN(val)) return
    updateSupply(itemId, Math.max(1, val))
  }

  // Suma 10 items supply de golpe
  const addx10ItemsSupply = () => {
    handleUpdateSupply(value + 10)
  }

  // Resta 10 items supply de golpe
  const removex10ItemsSupply = () => {
    handleUpdateSupply(value - 10)
  }

  // Elimina el item item supply
  const handleRemoveSupply = () => {
    removeSupply(itemId)
  }

  return (
    <Card shadow="md" className="flex-row">
      <CardBody>
        <div className="flex items-center gap-3">
          {/* Imagen del item */}
          <ItemImage id={itemId} className="w-full max-h-20" />

          {/* Input supply, con botones para sumar o restar de 10 */}
          <div className="flex gap-2 p-0.5 bg-content2 rounded-lg">
            <Button isIconOnly size="sm" variant="light" onPress={addx10ItemsSupply}>
              <ChevronUp size={20} />
            </Button>
            <NumberInput
              hideStepper
              size="sm"
              variant="flat"
              minValue={1}
              value={value}
              onChange={(val) => handleUpdateSupply(Number(val))}
            />
            <Button isIconOnly size="sm" variant="light" onPress={removex10ItemsSupply}>
              <ChevronDown size={20} />
            </Button>
          </div>
        </div>
      </CardBody>

      {/* Boton para elimnar el Item supply */}
      <CardFooter className="w-fit items-center justify-center">
        <Button isIconOnly size="sm" variant="light" color="danger" radius="full" className="w-5 min-w-5 h-5" onPress={handleRemoveSupply}>
          <XIcon size={18} />
        </Button>
      </CardFooter>
    </Card>
  )
})
