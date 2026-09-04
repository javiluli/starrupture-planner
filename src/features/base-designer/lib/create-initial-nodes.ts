import { BASE_CORE_NODE_ID, BASE_FIELD_NODE_ID } from '../base-designer.config'
import type { BaseDesignerNode } from '../types'
import { footprintToPixels, getBaseFieldPixelSize, getBuildingFootprint } from './building-dimensions'

/** Creates the immutable field and Base Core required by every design. */
export const createInitialBaseDesignerNodes = (): BaseDesignerNode[] => {
  const fieldSize = getBaseFieldPixelSize()
  const coreSize = footprintToPixels(getBuildingFootprint('base_core'))

  return [
    {
      id: BASE_FIELD_NODE_ID,
      type: 'group',
      data: { kind: 'field' },
      position: { x: 0, y: 0 },
      className: 'base-designer-field',
      draggable: false,
      selectable: false,
      connectable: false,
      deletable: false,
      style: { width: fieldSize, height: fieldSize },
    },
    {
      id: BASE_CORE_NODE_ID,
      type: 'core',
      data: {
        kind: 'core',
        buildingId: 'base_core',
        width: coreSize.width,
        height: coreSize.height,
      },
      parentId: BASE_FIELD_NODE_ID,
      extent: 'parent',
      position: {
        x: fieldSize / 2 - coreSize.width / 2,
        y: fieldSize / 2 - coreSize.height / 2,
      },
      draggable: false,
      selectable: false,
      connectable: false,
      deletable: false,
      style: coreSize,
    },
  ]
}
