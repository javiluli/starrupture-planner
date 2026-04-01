import { AssetImage, Typography } from '@/shared/ui'
import type { ProductionStep } from '../../../lib'
import type { ProductionItemsColumnKey } from '../lib/items-columns'

interface CellProps {
  row: ProductionStep
  columnKey: ProductionItemsColumnKey
  itemNameMap: Map<string, string>
}

export const ItemsDiagramCell = ({ row, columnKey, itemNameMap }: CellProps) => {
  switch (columnKey) {
    case 'item':
      return (
        <div className="max-w-12">
          <AssetImage kind="items" id={row.itemId} width={90} />
        </div>
      )
    case 'needed':
      return (
        <>
          <Typography as="span">{row.targetIpm.toFixed(2)} units/min of </Typography>
          <Typography as="span">{itemNameMap.get(row.itemId) ?? row.itemId}</Typography>
        </>
      )
    default:
      return null
  }
}
