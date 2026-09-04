import type { Building } from '@/shared/@types/building.type'
import { describe, expect, it } from 'vitest'
import { filterBuildingCatalog, getBuildingCatalogCategories } from './filter-building-catalog'

const buildings = [
  { id: 'fabricator', name: 'Fabricator', type: 'production', power: 10, heat: 5, recipes: [] },
  { id: 'furnace', name: 'Furnace', type: 'production', power: 20, heat: 8, recipes: [] },
  { id: 'solar_generator_v1', name: 'Solar Generator v.1', type: 'generator', power: -20, heat: 0, recipes: [] },
  { id: 'storage_depot_v1', name: 'Storage Depot v.1', type: 'storage', power: 0, heat: 0, recipes: [] },
] satisfies Building[]

describe('building catalog filters', () => {
  it('groups categories in source order and includes their counts', () => {
    expect(getBuildingCatalogCategories(buildings)).toEqual([
      { id: 'production', label: 'Production', count: 2 },
      { id: 'generator', label: 'Power', count: 1 },
      { id: 'storage', label: 'Storage', count: 1 },
    ])
  })

  it('filters by category without changing source order', () => {
    expect(filterBuildingCatalog(buildings, { category: 'production', query: '' }).map((building) => building.id)).toEqual([
      'fabricator',
      'furnace',
    ])
  })

  it('searches by name, id and human category without case sensitivity', () => {
    expect(filterBuildingCatalog(buildings, { category: '', query: 'FURN' }).map((building) => building.id)).toEqual(['furnace'])
    expect(filterBuildingCatalog(buildings, { category: '', query: 'storage_depot' }).map((building) => building.id)).toEqual([
      'storage_depot_v1',
    ])
    expect(filterBuildingCatalog(buildings, { category: '', query: 'power' }).map((building) => building.id)).toEqual([
      'solar_generator_v1',
    ])
  })

  it('combines category and query filters', () => {
    expect(filterBuildingCatalog(buildings, { category: 'production', query: 'fabricator' })).toEqual([buildings[0]])
    expect(filterBuildingCatalog(buildings, { category: 'storage', query: 'fabricator' })).toEqual([])
  })
})
