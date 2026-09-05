import type { CorporationLevelRef } from './corporations.type'

export type ItemType = 'raw' | 'processed' | 'component' | 'material' | 'ammo'

export interface RawItem {
  id: string
  name: string
  type: string
}

/** Item enriched with normalized type and corporation delivery requirements. */
export interface Item extends Omit<RawItem, 'type'> {
  type: ItemType
  /** Corporation levels that accept this item as a delivery requirement. */
  corporations: readonly CorporationLevelRef[]
}
