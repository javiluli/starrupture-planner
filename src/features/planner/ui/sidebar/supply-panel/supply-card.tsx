import { Flex, AssetImage } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Button, Card, CardBody, NumberInput } from '@heroui/react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { memo } from 'react'

interface SupplyCardProps {
  itemId: string
  itemName: string
  value: number
}

export const SupplyCard = memo(({ itemId, itemName, value }: SupplyCardProps) => {
  const incrementSupply = usePlannerStore(plannerSelectors.incrementSupply)
  const setSupply = usePlannerStore(plannerSelectors.setSupply)

  const handleUpdateSupply = (val: number) => {
    setSupply(itemId, val)
  }
  const addx1ItemsSupply = () => incrementSupply(itemId, 1)
  const removex1ItemsSupply = () => incrementSupply(itemId, -1)
  const addx10ItemsSupply = () => incrementSupply(itemId, 10)
  const removex10ItemsSupply = () => incrementSupply(itemId, -10)

  return (
    <Card className="">
      <CardBody className="py-2">
        <Flex gap="md">
          <AssetImage kind="items" id={itemId} width={72} alt={itemName} />

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
