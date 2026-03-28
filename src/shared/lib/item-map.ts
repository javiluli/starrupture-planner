import type { Item } from '@/shared/@types/production'

export const buildItemMap = (items: Item[]) => new Map(items.map((item) => [item.id, item]))
