import type { Building } from '@/shared/@types/building.type'
import { describe, expect, it } from 'vitest'
import { calculateBaseDesignerStats } from './calculate-base-designer-stats'

const buildings = [
  { id: 'base_core', name: 'Base Core', type: 'core', power: 0, heat: 0, recipes: [], levels: [{ level: 0, heatCapacity: 1200 }] },
  { id: 'generator', name: 'Generator', type: 'generator', power: 100, heat: 10, recipes: [] },
  { id: 'machine', name: 'Machine', type: 'production', power: 30, heat: 5, recipes: [] },
] satisfies Building[]

describe('calculateBaseDesignerStats', () => {
  it('separates generated and consumed power while accumulating heat', () => {
    expect(calculateBaseDesignerStats(['generator', 'machine', 'machine'], buildings)).toEqual({
      buildingCount: 3,
      generatedPower: 100,
      consumedPower: 60,
      powerBalance: 40,
      heat: 20,
      heatCapacity: 1200,
    })
  })

  it('ignores missing catalog entries and keeps the core capacity', () => {
    expect(calculateBaseDesignerStats(['unknown'], buildings)).toMatchObject({
      buildingCount: 1,
      generatedPower: 0,
      consumedPower: 0,
      heat: 0,
      heatCapacity: 1200,
    })
  })
})
