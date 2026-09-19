export type ColumnKey = 'item' | 'category' | 'production' | 'actions' | 'corporations'

export interface ItemsTableColumn {
  key: ColumnKey
  name: string
}

export const ITEMS_TABLE_COLUMNS: ItemsTableColumn[] = [
  { key: 'item', name: 'Item' },
  { key: 'category', name: 'Category' },
  { key: 'production', name: 'Production' },
  { key: 'actions', name: 'Actions' },
  { key: 'corporations', name: 'Corporations' },
]

export const ITEMS_TABLE_COLUMN_WIDTHS: Record<ColumnKey, string> = {
  item: '25%',
  category: '14%',
  production: '16%',
  actions: '10%',
  corporations: '35%',
}

export const ITEMS_TABLE_ESTIMATED_ROW_HEIGHT = 72
export const ITEMS_TABLE_OVERSCAN = 8
