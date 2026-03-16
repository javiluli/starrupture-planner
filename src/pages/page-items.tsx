import { BuildingSelect, CategorySelect, ItemCount, SearchInput, TableOfItems, useItemsTableData } from '@/features/items'
import { Flex, PageContainer, Panel } from '@/shared/ui'
import { itemsSelectors, useItemsStore } from '@/store/items.store'
import { useMemo } from 'react'

const PageItems = () => {
  /**
   * Zustand store
   */
  const itemsWithProduction = useItemsTableData()

  /**
   * Filters
   */
  const filters = useItemsStore(itemsSelectors.filters)
  const setSelectedCategory = useItemsStore(itemsSelectors.setSelectedCategory)
  const setSelectedBuildingId = useItemsStore(itemsSelectors.setSelectedBuildingId)
  const setSearchQuery = useItemsStore(itemsSelectors.setSearchQuery)
  const getFilteredItems = useItemsStore(itemsSelectors.getFilteredItems)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredItems = useMemo(() => getFilteredItems(itemsWithProduction), [getFilteredItems, itemsWithProduction, filters])

  return (
    <PageContainer>
      {/* Header and filters */}
      <Panel padding="sm">
        <Flex wrap="wrap" justify="between" align="end" gap="lg">
          {/* Filters */}
          <Flex>
            <CategorySelect onChange={setSelectedCategory} />
            <BuildingSelect onChange={setSelectedBuildingId} />
            <SearchInput onSearch={setSearchQuery} />
          </Flex>

          {/* Contador de items */}
          <ItemCount totalItems={filteredItems.length} />
        </Flex>
      </Panel>

      {/* Table container */}
      <div className="flex-1 overflow-y-scroll panel-muted">
        <TableOfItems dataFiltered={filteredItems} />
      </div>
    </PageContainer>
  )
}

export default PageItems
