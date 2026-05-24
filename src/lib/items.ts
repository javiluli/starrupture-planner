import type { Item } from '@/shared/@types/item.type'

export const buildItemMap = (items: Item[]) => new Map(items.map((item) => [item.id, item]))
