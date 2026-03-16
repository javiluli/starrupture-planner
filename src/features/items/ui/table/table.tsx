import type { CorporationLevelMatch, Item } from '@/shared/@types/production'
import { Typography } from '@/shared/ui'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { ActionsCell, CategoryCell, CorporationsCell, ItemCell, ProductionCell } from './table-cells'
import { getColumns, type ColumnKey } from './table-columns'
import { useTranslation } from 'react-i18next'

interface Props {
  dataFiltered: (Item & {
    buildingId: string | null
    production: string | undefined
    corporations: CorporationLevelMatch[] | undefined
  })[]
}

export const TableOfItems = ({ dataFiltered }: Props) => {
  const { t } = useTranslation('items')
  const columns = getColumns(t as unknown as (key: string) => string)
  const renderCell = (item: (typeof dataFiltered)[number], columnKey: React.Key) => {
    const key = columnKey as ColumnKey

    switch (key) {
      case 'item':
        return <ItemCell item={item} />
      case 'category':
        return <CategoryCell itemType={item.type} />
      case 'production':
        return <ProductionCell itemProduction={item.production} />
      case 'actions':
        return <ActionsCell item={item} />
      case 'corporations':
        return <CorporationsCell corporations={item.corporations} />
      default:
        return null
    }
  }

  return (
    <Table removeWrapper isHeaderSticky aria-label="Game item table">
      <TableHeader columns={columns} className="bg-content1/60">
        {(column) => (
          <TableColumn key={column.key} className="uppercase text-foreground/50">
            <Typography as="span" variant="micro" tone="soft">
              {column.name}
            </Typography>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'No rows to display.'}
        items={dataFiltered.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })}
      >
        {(item) => (
          <TableRow key={item.id} className="border-b border-divider/60 hover:bg-content1/30 transition-colors">
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
