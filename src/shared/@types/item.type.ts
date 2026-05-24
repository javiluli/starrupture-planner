export type ItemType = 'raw' | 'processed' | 'component' | 'material' | 'ammo'

export interface Item {
  id: string
  name: string
  type: ItemType
}
