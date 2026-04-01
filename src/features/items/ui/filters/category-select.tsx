import type { ItemType } from '@/shared/@types/item.type'
import { Select, SelectItem } from '@heroui/react'
import { useItemsFilters } from '@/features/items/hooks/use-items-filters'

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
  const { filters, setSelectedCategory } = useItemsFilters()
  const selectedKeys = filters.selectedCategory ? [filters.selectedCategory] : []

  return (
    <Select
      size='sm'
      variant='bordered'
      className='w-48'
      items={CATEGORY_OPTIONS}
      isClearable={true}
      placeholder='Category by filter'
      selectedKeys={selectedKeys}
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
