import type { CorporationLevelRef } from './corporations.type'

export type ItemType = 'raw' | 'processed' | 'component' | 'material' | 'ammo'

export interface Item {
  id: string
  name: string
  type: ItemType
  /** Corporation levels that accept this item as a delivery requirement. */
  corporations?: CorporationLevelRef[]
}
