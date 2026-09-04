import { describe, expect, it } from 'vitest'
import type { ItemFilterInput } from './types'
import { filterItems } from './filter-items'

const items = [
  {
    id: 'titanium_plate',
    name: 'Titanium Plate',
    type: 'component',
    buildingId: 'fabricator',
    corporations: [{ corporationId: 'moon_energy', corporationName: 'Moon Energy', level: 2 }],
  },
  {
    id: 'wolfram_powder',
    name: 'Wolfram Powder',
    type: 'processed',
    buildingId: 'furnace',
    corporations: [{ corporationId: 'clever_robotics', corporationName: 'Clever Robotics', level: 1 }],
  },
  {
    id: 'calcium_ore',
    name: 'Calcium Ore',
    type: 'raw',
    buildingId: null,
    corporations: undefined,
  },
]

const EMPTY_FILTERS: ItemFilterInput = {
  selectedCategory: '',
  selectedBuildingId: '',
  selectedCorporationId: '',
  searchQuery: '',
}

describe('filterItems', () => {
  it('returns every item when no filter is active', () => {
    expect(filterItems(items, EMPTY_FILTERS)).toEqual(items)
  })

  it('filters by category, building and corporation', () => {
    expect(filterItems(items, { ...EMPTY_FILTERS, selectedCategory: 'processed' }).map((item) => item.id)).toEqual([
      'wolfram_powder',
    ])
    expect(filterItems(items, { ...EMPTY_FILTERS, selectedBuildingId: 'fabricator' }).map((item) => item.id)).toEqual([
      'titanium_plate',
    ])
    expect(filterItems(items, { ...EMPTY_FILTERS, selectedCorporationId: 'moon_energy' }).map((item) => item.id)).toEqual([
      'titanium_plate',
    ])
  })

  it('matches search text without case sensitivity', () => {
    const result = filterItems(items, { ...EMPTY_FILTERS, searchQuery: 'tItAnIuM' })

    expect(result.map((item) => item.id)).toEqual(['titanium_plate'])
  })

  it('combines active filters instead of applying them independently', () => {
    const result = filterItems(items, {
      selectedCategory: 'component',
      selectedBuildingId: 'fabricator',
      selectedCorporationId: 'moon_energy',
      searchQuery: 'plate',
    })

    expect(result.map((item) => item.id)).toEqual(['titanium_plate'])
  })
})
