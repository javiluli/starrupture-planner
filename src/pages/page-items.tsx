import {
  BuildingSelect,
  CategorySelect,
  ClearFiltersButton,
  CorporationSelect,
  ItemsTable,
  SearchInput,
  useFilteredItemRows,
  useItemsTableRows,
} from '@/features/items'
import { Flex, PageContainer, PageContent, PageHeader, StatLabel } from '@/shared/ui'

export const PageItems = () => {
  const itemRows = useItemsTableRows()
  const filteredItems = useFilteredItemRows(itemRows)

  return (
    <PageContainer>
      <PageHeader>
        <Flex wrap="wrap" justify="between" align="end" gap="lg">
          <Flex wrap="wrap">
            <CategorySelect />
            <BuildingSelect />
            <CorporationSelect />
            <SearchInput />
            <ClearFiltersButton />
          </Flex>

          <StatLabel value={filteredItems.length} label="Item" />
        </Flex>
      </PageHeader>

      <PageContent overflow="hidden" surface="muted">
        <ItemsTable items={filteredItems} />
      </PageContent>
    </PageContainer>
  )
}
