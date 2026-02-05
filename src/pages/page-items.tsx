import CategoryFilter from '@/components/items/components/category-filter'
import ItemsBuildingFilter from '@/components/items/components/items-building-filter'
import ItemsSearch from '@/components/items/components/items-search'
import TableOfItems from '@/components/items/components/table-of-items'
import { useItemStore } from '@/store/items.store'
import { useMemo, useState } from 'react'

const PageItems = () => {
  /**
   * Zustand store
   */
  const getItemsTableData = useItemStore((state) => state.getItemsTableData)
  const itemsWithProduction = getItemsTableData()
  /**
   * States component
   */
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    return itemsWithProduction
      .filter((item) => (selectedCategory === 'all' ? true : item.type === selectedCategory))
      .filter((item) => (selectedBuildingId ? item.buildingId === selectedBuildingId : true))
      .filter((item) => (searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true))
  }, [itemsWithProduction, selectedCategory, selectedBuildingId, searchQuery])

  return (
    <>
      <div className="px-6 py-2 space-y-2 ">
        <div className="flex items-center space-x-4">
          <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
          <ItemsBuildingFilter onBuildingChange={setSelectedBuildingId} />
          <ItemsSearch onSearchChange={setSearchQuery} />
          <span className="font-semibold">Total: {filteredItems.length}</span>
        </div>
      </div>

      <TableOfItems dataFiltered={filteredItems} />
    </>
  )
}

export default PageItems
