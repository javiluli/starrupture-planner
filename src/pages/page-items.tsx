import { BuildingSelect, CategorySelect, ClearFiltersButton, CorporationSelect, SearchInput, TableOfItems, useFilteredItems, useItemsTableData, useItemsFilters } from '@/features/items'
import { Flex, PageContainer, Panel, StatLabel } from '@/shared/ui'
import { useEffect } from 'react'

const PageItems = () => {
  /**
   * Hooks
   */
  const itemsWithProduction = useItemsTableData()
  const { resetFilter } = useItemsFilters()
  const filteredItems = useFilteredItems(itemsWithProduction)

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
      <Panel padding='sm'>
        <Flex wrap='wrap' justify='between' align='end' gap='lg'>
          {/* Filters menu */}
          <Flex wrap='wrap'>
            <CategorySelect />
            <BuildingSelect />
            <CorporationSelect />
            <SearchInput />
            <ClearFiltersButton />
          </Flex>

          {/* Items count */}
          <StatLabel value={filteredItems.length} label='Item' />
        </Flex>
      </Panel>

      {/* Main table */}
      <div className='flex-1 overflow-y-scroll panel-muted'>
        <TableOfItems dataFiltered={filteredItems} />
      </div>
    </PageContainer>
  )
}

export default PageItems
