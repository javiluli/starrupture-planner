import { describe, expect, it } from 'vitest'
import { BASE_DESIGNER_FALLBACK_FOOTPRINT } from '../base-designer.config'
import { getBuildingFootprintInfo } from './building-dimensions'

describe('building footprint information', () => {
  it('identifies a footprint backed by the game catalog', () => {
    expect(getBuildingFootprintInfo('smelter')).toEqual({
      footprint: { columns: 4, rows: 4 },
      isEstimated: false,
    })
  })

  it('identifies the fallback footprint as estimated', () => {
    expect(getBuildingFootprintInfo('fabricator')).toEqual({
      footprint: BASE_DESIGNER_FALLBACK_FOOTPRINT,
      isEstimated: true,
    })
  })
})
