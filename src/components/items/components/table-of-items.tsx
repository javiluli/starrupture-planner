import { CorporationImage, ItemImage } from '@/components/ui/asset-image'
import { ITEM_COLORS } from '@/constants/graph'
import { usePlannerStore } from '@/store/planner.store'
import type { CorporationLevelMatch, Item } from '@/types/production'
import { colorWithOpacity } from '@/utils'
import { Button, Chip, cn, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

interface Props {
  dataFiltered: (Item & {
    buildingId: string | null
    production: string | undefined
    corporations: CorporationLevelMatch[] | undefined
  })[]
}

const columns = [
  { name: 'Item', uid: 'item' },
  { name: 'Category', uid: 'category' },
  { name: 'Production', uid: 'production' },
  { name: 'Acions', uid: 'actions' },
  { name: 'Corporations', uid: 'corporations' },
]

const TableOfItems = ({ dataFiltered }: Props) => {
  const navigate = useNavigate()

  const setTargetId = usePlannerStore((state) => state.setTargetId)

  const renderCell = (item: (typeof dataFiltered)[number], columnKey: string | number) => {
    switch (columnKey) {
      case 'item':
        return (
          <div className="flex items-center space-x-1.5">
            <ItemImage id={item.id} className="w-14 h-14" />
            <span>{item.name}</span>
          </div>
        )
      case 'category':
        return (
          <div className="flex flex-col">
            <Chip
              className={cn('capitalize bg-item-current/20 text-item-current')}
              style={{
                backgroundColor: colorWithOpacity(ITEM_COLORS[item.type as keyof typeof ITEM_COLORS], 20),
                color: ITEM_COLORS[item.type as keyof typeof ITEM_COLORS],
              }}
              size="sm"
              variant="flat"
            >
              {item.type}
            </Chip>
          </div>
        )
      case 'production':
        return <span>{item.production}</span>
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            {item.type !== 'raw' && (
              <Button
                size="sm"
                color="primary"
                onPress={() => {
                  setTargetId(item.id)
                  navigate('/')
                }}
              >
                Planner
              </Button>
            )}
          </div>
        )
      case 'corporations':
        return (
          <div className="flex space-x-4">
            {item.corporations?.map((c) => (
              <div className="flex space-x-1.5">
                <CorporationImage id={c.corporationId} className="h-5" />
                <span>{c.corporationId.split('_')[0]}</span>
                <span>L. {c.level}</span>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Table isStriped aria-label="Game item table">
      <TableHeader columns={columns}>{(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}</TableHeader>
      <TableBody
        emptyContent={'No rows to display.'}
        items={dataFiltered.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })}
      >
        {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, String(columnKey))}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default TableOfItems
