import { Flex, AssetImage } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Button, Card, CardBody, NumberInput } from '@heroui/react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { memo } from 'react'

/**
 * React.memo se utiliza aqui por razones de performance criticas:
 * * 1. Aislamiento de Renders: Este componente esta suscrito al PlannerStore.
 * Sin memo, cualquier cambio en el canvas de React Flow (como mover un nodo)
 * podria disparar re-renders innecesarios en el Sidebar.
 * * 2. Estabilidad de la UI: Al ser un panel con multiples sub-componentes
 * (cards, imagenes, inputs), el memo garantiza que React solo procese
 * los cambios si los datos de suministros (supplyCountByItem) han variado realmente.
 * * 3. Fluidez del Diagrama: Mantiene el hilo principal libre de carga visual
 * pesada mientras el motor de React Flow realiza calculos de posicionamiento.
 */

interface SupplyCardProps {
  itemId: string
  itemName: string
  value: number
}

/**
 * Componetne <Card/> que permie editar la cantidad de items "supply" seleccionado
 * Este muestra la imagen del item,
 * un input para valor concreto junto a dos botones que suman o restan 10 items de golpe
 * y un boton para elinar el item "supply"
 *
 * @param itemId ID del item al que se le suma un "supply"
 * @param itemName Nombre legible del item
 * @param value Cantidad de la suma "supply"
 */
export const SupplyCard = memo(({ itemId, itemName, value }: SupplyCardProps) => {
  const incrementSupply = usePlannerStore(plannerSelectors.incrementSupply)
  const setSupply = usePlannerStore(plannerSelectors.setSupply)

  // Aplica la cantidad de input a la cantidad de items supply
  const handleUpdateSupply = (val: number) => {
    setSupply(itemId, val)
  }
  // Suma 1 item supply
  const addx1ItemsSupply = () => incrementSupply(itemId, 1)
  // Resta 1 item supply
  const removex1ItemsSupply = () => incrementSupply(itemId, -1)
  // Suma 10 items supply de golpe
  const addx10ItemsSupply = () => incrementSupply(itemId, 10)
  // Resta 10 items supply de golpe
  const removex10ItemsSupply = () => incrementSupply(itemId, -10)

  return (
    <Card className="">
      <CardBody className="py-2">
        <Flex gap="md">
          {/* Imagen del item */}
          <AssetImage kind="items" id={itemId} width={72} alt={itemName} />

          {/* Input supply, con botones para sumar o restar de 10 */}
          <Flex className="bg-content2/60 rounded-lg border border-divider/60">
            <Button isIconOnly size="sm" variant="light" aria-label={`Decrease ${itemName} supply by 10`} onPress={removex10ItemsSupply}>
              <ChevronsLeft />
            </Button>
            <Button isIconOnly size="sm" variant="light" aria-label={`Decrease ${itemName} supply by 1`} onPress={removex1ItemsSupply}>
              <ChevronLeft />
            </Button>
            <NumberInput
              aria-label={`${itemName} supply per minute`}
              hideStepper
              size="sm"
              variant="faded"
              classNames={{
                inputWrapper: 'bg-transparent shadow-none',
              }}
              minValue={1}
              value={value}
              onChange={(val) => handleUpdateSupply(Number(val))}
            />
            <Button isIconOnly size="sm" variant="light" aria-label={`Increase ${itemName} supply by 1`} onPress={addx1ItemsSupply}>
              <ChevronRight />
            </Button>
            <Button isIconOnly size="sm" variant="light" aria-label={`Increase ${itemName} supply by 10`} onPress={addx10ItemsSupply}>
              <ChevronsRight />
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
})
