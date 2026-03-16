export type ColumnKey = 'item' | 'category' | 'production' | 'actions' | 'corporations'

interface TableColumn {
  key: ColumnKey
  name: string
}

export const getColumns = (t: (key: string) => string): TableColumn[] => [
  { key: 'item', name: t('table.item') },
  { key: 'category', name: t('table.category') },
  { key: 'production', name: t('table.production') },
  { key: 'actions', name: t('table.actions') },
  { key: 'corporations', name: t('table.corporations') },
]
