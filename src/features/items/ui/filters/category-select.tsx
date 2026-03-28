import type { ItemType } from '@/shared/@types/item.type'
import { itemsSelectors, useItemsStore } from '@/store/items.store'
import { Select, SelectItem } from '@heroui/react'

const CATEGORY_OPTIONS: {
  key: ItemType
  label: string
}[] = [
  { key: 'ammo', label: 'Ammo' },
  { key: 'component', label: 'Component' },
  { key: 'material', label: 'Material' },
  { key: 'processed', label: 'Processed' },
  { key: 'raw', label: 'Raw' },
]

export const CategorySelect = () => {
  const setSelectedCategory = useItemsStore(itemsSelectors.setSelectedCategory)

  return (
    <Select
      size="sm"
      variant="bordered"
      className="w-48"
      items={CATEGORY_OPTIONS}
      isClearable={true}
      placeholder="Category by filter"
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {(i) => (
        <SelectItem key={i.key} textValue={i.label}>
          {i.label}
        </SelectItem>
      )}
    </Select>
  )
}
