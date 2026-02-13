import { ItemImage } from '@/components/ui/asset-image'
import { useDataStore } from '@/store/data.store'
import { usePlannerStore } from '@/store/planner.store'
import { Autocomplete, AutocompleteItem } from '@heroui/react'

export function PlannerItemSelector() {
  const items = useDataStore((state) => state.items)
  const targetId = usePlannerStore((state) => state.targetId)
  const setTargetId = usePlannerStore((state) => state.setTargetId)

  return (
    <Autocomplete
      size="sm"
      className="w-72"
      placeholder="Select an item"
      maxListboxHeight={600}
      selectedKey={targetId}
      onSelectionChange={(id) => setTargetId(id as string)}
    >
      {items.map((i) => (
        <AutocompleteItem key={i.id} textValue={i.name} startContent={<ItemImage id={i.id} className="w-full h-8" />}>
          {i.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}
