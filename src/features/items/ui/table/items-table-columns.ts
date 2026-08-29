export type ColumnKey = 'item' | 'category' | 'production' | 'actions' | 'corporations'

interface TableColumn {
  key: ColumnKey
  name: string
}

export const getColumns = (): TableColumn[] => [
  { key: 'item', name: 'Item' },
  { key: 'category', name: 'Category' },
  { key: 'production', name: 'Production' },
  { key: 'actions', name: 'Actions' },
  { key: 'corporations', name: 'Corporations' },
]
