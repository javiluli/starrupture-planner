import {
  BuildingSelect,
  CategorySelect,
  ClearFiltersButton,
  CorporationSelect,
  SearchInput,
  TableOfItems,
  useFilteredItems,
  useItemsTableData,
  useItemsFilters,
} from '@/features/items'
import { Flex, PageContainer, PageContent, PageHeader, StatLabel } from '@/shared/ui'
import { useEffect } from 'react'

export const PageItems = () => {
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
      <PageHeader>
        <Flex wrap="wrap" justify="between" align="end" gap="lg">
          {/* Filters menu */}
          <Flex wrap="wrap">
            <CategorySelect />
            <BuildingSelect />
            <CorporationSelect />
            <SearchInput />
            <ClearFiltersButton />
          </Flex>

          {/* Items count */}
          <StatLabel value={filteredItems.length} label="Item" />
        </Flex>
      </PageHeader>

      {/* Main table */}
      <PageContent className="rounded-2xl border border-divider/70 bg-content1/20">
        <TableOfItems dataFiltered={filteredItems} />
      </PageContent>
    </PageContainer>
  )
}
