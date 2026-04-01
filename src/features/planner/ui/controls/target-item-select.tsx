import { AssetImage } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { usePlannerTarget } from '@/features/planner'

export function TargetItemSelect() {
  const items = useDataStore(dataSelectors.items)
  const targetId = usePlannerStore(plannerSelectors.targetId)
  const { selectTargetItem } = usePlannerTarget()

  return (
    <Autocomplete
      size='sm'
      variant='bordered'
      className='w-64'
      placeholder='Select an item'
      maxListboxHeight={600}
      selectedKey={targetId}
      onSelectionChange={(id) => selectTargetItem(id as string)}
    >
      {items.map((i) => (
        <AutocompleteItem key={i.id} textValue={i.name} startContent={<AssetImage kind='items' id={i.id} width={32} />}>
          {i.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}
