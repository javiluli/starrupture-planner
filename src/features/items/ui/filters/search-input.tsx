import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useItemsFilters } from '@/features/items/hooks/use-items-filters'

export const SearchInput = () => {
  const { filters, setSearchQuery } = useItemsFilters()

  return (
    <Input
      type='search'
      size='sm'
      variant='bordered'
      className='w-50'
      placeholder='Search items'
      startContent={<SearchIcon size={18} />}
      value={filters.searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  )
}
