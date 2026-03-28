import { BuildingSelect, CategorySelect, CorporationSelect, SearchInput, TableOfItems, useItemsTableData } from '@/features/items'
import { Flex, PageContainer, Panel, StatLabel } from '@/shared/ui'
import { itemsSelectors, useItemsStore } from '@/store/items.store'
import { useEffect, useMemo } from 'react'

const PageItems = () => {
  /**
   * Hooks
   */
  const itemsWithProduction = useItemsTableData()

  /**
   * Filters
   */
  const filters = useItemsStore(itemsSelectors.filters)
  const getFilteredItems = useItemsStore(itemsSelectors.getFilteredItems)
  const resetFilter = useItemsStore(itemsSelectors.resetFilter)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredItems = useMemo(() => getFilteredItems(itemsWithProduction), [getFilteredItems, itemsWithProduction, filters])

  /**
   * Start with clean/empty filters
   */
  useEffect(() => {
    resetFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageContainer>
      {/* Header and filters */}
      <Panel padding="sm">
        <Flex wrap="wrap" justify="between" align="end" gap="lg">
          {/* Filters menu */}
          <Flex wrap="wrap">
            <CategorySelect />
            <BuildingSelect />
            <CorporationSelect />
            <SearchInput />
          </Flex>

          {/* Items count */}
          <StatLabel value={filteredItems.length} label="Item" />
        </Flex>
      </Panel>

      {/* Main table */}
      <div className="flex-1 overflow-y-scroll panel-muted">
        <TableOfItems dataFiltered={filteredItems} />
      </div>
    </PageContainer>
  )
}

export default PageItems
