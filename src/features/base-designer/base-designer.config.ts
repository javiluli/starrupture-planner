export const BASE_FIELD_NODE_ID = 'base-field'
export const BASE_CORE_NODE_ID = 'base-core'
export const BASE_DESIGNER_GRID_SIZE = 10
export const BASE_DESIGNER_FALLBACK_FOOTPRINT = { columns: 4, rows: 4 } as const

/** Semantic colors consumed by React Flow JavaScript properties. */
export const BASE_DESIGNER_FLOW_COLORS = {
  canvas: 'hsl(var(--heroui-background) / 1)',
  grid: 'hsl(var(--heroui-content3) / 1)',
  edge: 'hsl(var(--heroui-primary) / 0.85)',
} as const

export const BASE_DESIGNER_FIT_VIEW = {
  padding: 0.08,
  duration: 350,
} as const
