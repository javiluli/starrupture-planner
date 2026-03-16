import { Flex, AssetImage, Typography } from '@/shared/ui'
import { filterItemsByQuery, groupItemsByType, SUPPLY_ITEM_TYPE_ORDER } from '@/features/planner/lib/supply-items'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'

export function SupplyModal() {
  const items = useDataStore(dataSelectors.items)
  const addSupplyNode = usePlannerStore(plannerSelectors.addSupplyNode)

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => filterItemsByQuery(items, search), [items, search])
  const itemsByType = useMemo(() => groupItemsByType(filteredItems), [filteredItems])

  const handleSupply = (itemId: string) => {
    addSupplyNode(itemId)
    setSearch('')
    onClose()
  }

  return (
    <>
      <Flex justify="between" className="mb-4">
        <Typography variant="h4">Supply input items</Typography>
        <Button size="sm" variant="ghost" onPress={onOpen}>
          Add an item
        </Button>
      </Flex>
      <Modal isOpen={isOpen} size="5xl" scrollBehavior="inside" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Typography variant="h3">Select input items</Typography>
              </ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  variant="bordered"
                  placeholder="Type to search..."
                  startContent={<SearchIcon size={18} />}
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                />

                {SUPPLY_ITEM_TYPE_ORDER.map((type) => {
                  const sectionItems = itemsByType[type]

                  if (!sectionItems.length) return null

                  return (
                    <div key={type} className="mb-6">
                      <Flex justify="between" className="mb-3">
                        <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
                          {type}
                        </Typography>
                        <Chip size="sm" variant="bordered" className="text-foreground/80">
                          {sectionItems.length} items
                        </Chip>
                      </Flex>

                      <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                        {sectionItems.map((i) => (
                          <Flex
                            as="li"
                            key={i.id}
                            direction="col"
                            align="center"
                            gap="sm"
                            className="group panel-muted p-3 cursor-pointer transition-colors hover:bg-content3/60"
                            onClick={() => handleSupply(i.id)}
                          >
                            <AssetImage kind="items" id={i.id} className="w-24 h-24" />
                            <Typography
                              as="span"
                              variant="micro"
                              tone="soft"
                              className="text-center transition-colors group-hover:text-foreground"
                            >
                              {i.name}
                            </Typography>
                          </Flex>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
