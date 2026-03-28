import type { Item } from '@/shared/@types/production'

export const SUPPLY_ITEM_TYPE_ORDER: Item['type'][] = ['raw', 'processed', 'material', 'component', 'ammo']

export const filterItemsByQuery = (items: Item[], query: string) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return items
  return items.filter((item) => item.name.toLowerCase().includes(normalized))
}

export const groupItemsByType = (items: Item[]) =>
  items.reduce<Record<Item['type'], Item[]>>(
    (acc, item) => {
      acc[item.type].push(item)
      return acc
    },
    {
      raw: [],
      processed: [],
      component: [],
      material: [],
      ammo: [],
    },
  )
