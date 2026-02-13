import { ItemImage } from '@/components/ui/asset-image'
import { useDataStore } from '@/store/data.store'
import { usePlannerStore } from '@/store/planner.store'
import type { Item } from '@/types/production'
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

export function SidebarModalItemSupply() {
  const items = useDataStore((state) => state.items)
  const addSupplyNode = usePlannerStore((state) => state.addSupplyNode)

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [search, setSearch] = useState('')

  const ITEM_TYPE_ORDER: Item['type'][] = ['raw', 'processed', 'material', 'component', 'ammo']

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, search])

  const itemsByType = useMemo(
    () =>
      filteredItems.reduce<Record<Item['type'], Item[]>>(
        (acc, item) => {
          acc[item.type].push(item)
          return acc
        },
        {
          raw: [],
          processed: [],
          component: [],
          material: [],
          ammo: [],
        },
      ),
    [filteredItems],
  )

  const handleSupply = (itemId: string) => {
    addSupplyNode(itemId)
    setSearch('')
    onClose()
  }

  return (
    <>
      <Button variant="ghost" onPress={onOpen}>
        Select input items
      </Button>
      <Modal isOpen={isOpen} size="5xl" scrollBehavior="inside" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Select input items</ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  placeholder="Type to search..."
                  startContent={<SearchIcon size={18} />}
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                />

                {ITEM_TYPE_ORDER.map((type) => {
                  const sectionItems = itemsByType[type]

                  if (!sectionItems.length) return null

                  return (
                    <div key={type} className="mb-2">
                      <h2 className="font-semibold uppercase text-lg mb-4">{type}</h2>

                      <ul className="flex flex-wrap gap-4">
                        {sectionItems.map((i) => (
                          <li
                            key={i.id}
                            className="flex flex-col justify-center items-center w-30 ring-3 ring-foreground/20 hover:ring-foreground/80 rounded-2xl cursor-pointer"
                            onClick={() => handleSupply(i.id)}
                          >
                            <ItemImage id={i.id} className="w-full h-28" />
                            <span className="text-xs text-foreground text-center p-2">{i.name}</span>
                          </li>
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
