/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { usePlannerStore } from './planner.store'

const resetStore = () => {
  sessionStorage.clear()
  usePlannerStore.setState({
    targetId: '',
    targetIpm: 0,
    supplyCountByItem: {},
    buildingVariantByItemId: {},
  })
}

describe('planner store', () => {
  beforeEach(resetStore)

  it('keeps rate at zero without a target and at least one with a target', () => {
    const actions = usePlannerStore.getState()

    actions.setTargetIpm(40)
    expect(usePlannerStore.getState().targetIpm).toBe(0)

    actions.setTargetId('ceramics')
    actions.setTargetIpm(0)
    expect(usePlannerStore.getState().targetIpm).toBe(1)

    actions.setTargetId('')
    expect(usePlannerStore.getState().targetIpm).toBe(0)
  })

  it('updates the production target and building variants', () => {
    const actions = usePlannerStore.getState()

    actions.setTargetId('ceramics')
    actions.setTargetIpm(60)
    actions.setBuildingVariantForItem('ceramics', 'furnace_v2')

    expect(usePlannerStore.getState()).toMatchObject({
      targetId: 'ceramics',
      targetIpm: 60,
      buildingVariantByItemId: { ceramics: 'furnace_v2' },
    })

    usePlannerStore.getState().resetBuildingVariants()
    expect(usePlannerStore.getState().buildingVariantByItemId).toEqual({})
  })

  it('sets supply and removes invalid or exhausted amounts', () => {
    const actions = usePlannerStore.getState()

    actions.setSupplyCount('calcium_block', 15)
    actions.setSupplyCount('wolfram_bar', 8)
    actions.setSupplyCount('calcium_block', Number.NaN)

    expect(usePlannerStore.getState().supplyCountByItem).toEqual({ wolfram_bar: 8 })

    usePlannerStore.getState().incrementSupplyCount('wolfram_bar', -8)
    expect(usePlannerStore.getState().supplyCountByItem).toEqual({})
  })

  it('adds an empty supply slot, increments it and removes it explicitly', () => {
    const actions = usePlannerStore.getState()

    actions.addSupplyItem('ceramics')
    expect(usePlannerStore.getState().supplyCountByItem).toEqual({ ceramics: 0 })

    usePlannerStore.getState().incrementSupplyCount('ceramics', 4)
    expect(usePlannerStore.getState().supplyCountByItem).toEqual({ ceramics: 4 })

    usePlannerStore.getState().removeSupplyItem('ceramics')
    expect(usePlannerStore.getState().supplyCountByItem).toEqual({})
  })
})
