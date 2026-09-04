import type { Building } from '@/shared/@types/building.type'
import { describe, expect, it } from 'vitest'
import { buildProductionPlan } from './build-production-plan'

const buildings = [
  {
    id: 'assembler',
    name: 'Assembler',
    power: 10,
    heat: 4,
    type: 'production',
    upgrade: 'assembler_v2',
    recipes: [
      {
        output: { id: 'plate', amount_per_minute: 5 },
        inputs: [{ id: 'ingot', amount_per_minute: 10 }],
      },
    ],
  },
  {
    id: 'assembler_v2',
    name: 'Assembler V2',
    power: 18,
    heat: 7,
    type: 'production',
    recipes: [
      {
        output: { id: 'plate', amount_per_minute: 10 },
        inputs: [{ id: 'ingot', amount_per_minute: 10 }],
      },
    ],
  },
  {
    id: 'smelter',
    name: 'Smelter',
    power: 5,
    heat: 2,
    type: 'production',
    recipes: [
      {
        output: { id: 'ingot', amount_per_minute: 10 },
        inputs: [{ id: 'ore', amount_per_minute: 20 }],
      },
    ],
  },
  {
    id: 'orbital_cargo_launcher',
    name: 'Orbital cargo launcher',
    power: 100,
    heat: 20,
    type: 'transport',
    recipes: [],
  },
] satisfies Building[]

const buildPlan = ({
  supplyCountByItem = {},
  buildingVariantByItemId = {},
  isExportable = false,
}: {
  supplyCountByItem?: Record<string, number>
  buildingVariantByItemId?: Record<string, string>
  isExportable?: boolean
} = {}) =>
  buildProductionPlan({
    buildings,
    targetId: 'plate',
    targetIpm: 10,
    supplyCountByItem,
    buildingVariantByItemId,
    isExportable,
  })

describe('buildProductionPlan', () => {
  it('builds recursive production steps and global stats', () => {
    const plan = buildPlan()

    expect(plan.steps).toEqual([
      expect.objectContaining({ itemId: 'plate', targetIpm: 10, buildingCount: 2, buildingId: 'assembler' }),
      expect.objectContaining({ itemId: 'ingot', targetIpm: 20, buildingCount: 2, buildingId: 'smelter' }),
    ])
    expect(plan.stats).toEqual({ buildings: 4, power: 30, heat: 12 })
  })

  it('uses partial supply before propagating the remaining demand', () => {
    const plan = buildPlan({ supplyCountByItem: { ingot: 5 } })
    const ingotStep = plan.steps.find((step) => step.itemId === 'ingot')

    expect(ingotStep).toEqual(expect.objectContaining({ targetIpm: 15, buildingLoad: 1.5, buildingCount: 2, supplyCount: 5 }))
  })

  it('removes a production branch when supply covers its complete demand', () => {
    const plan = buildPlan({ supplyCountByItem: { ingot: 20 } })

    expect(plan.steps.map((step) => step.itemId)).toEqual(['plate'])
    expect(plan.stats).toEqual({ buildings: 2, power: 20, heat: 8 })
  })

  it('resolves the selected building variant and its recipe', () => {
    const plan = buildPlan({ buildingVariantByItemId: { plate: 'assembler_v2' } })

    expect(plan.steps).toEqual([
      expect.objectContaining({ itemId: 'plate', buildingId: 'assembler_v2', buildingCount: 1 }),
      expect.objectContaining({ itemId: 'ingot', targetIpm: 10, buildingCount: 1 }),
    ])
    expect(plan.stats).toEqual({ buildings: 2, power: 23, heat: 9 })
  })

  it('includes orbital launchers in stats for exportable targets', () => {
    const plan = buildPlan({ isExportable: true })

    expect(plan.stats).toEqual({ buildings: 5, power: 130, heat: 32 })
  })
})
