import { itemsSelectors, useItemsStore } from '@/store/items.store'
import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'

export const SearchInput = () => {
  const setSearchQuery = useItemsStore(itemsSelectors.setSearchQuery)

  return (
    <Input
      type="search"
      size="sm"
      variant="bordered"
      className="w-50"
      placeholder="Search items"
      startContent={<SearchIcon size={18} />}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  )
}
