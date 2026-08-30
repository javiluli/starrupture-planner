import type { CorporationsById } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { describe, expect, it } from 'vitest'
import { calculateCorporationLevelRequirements } from './corporation-requirements'

const corporations = {
  'Moon Energy': {
    id: 'moon_energy',
    description: 'Energy systems',
    levels: [
      {
        level: 2,
        xp: 600,
        components: [{ id: 'ceramics', points: 5 }],
        rewards: [],
      },
    ],
  },
  'Clever Robotics': {
    id: 'clever_robotics',
    description: 'Automation systems',
    levels: [
      {
        level: 3,
        xp: 900,
        components: [{ id: 'ceramics', points: 10 }],
        rewards: [],
      },
    ],
  },
} satisfies CorporationsById

const item = {
  id: 'ceramics',
  name: 'Ceramics',
  type: 'component',
  corporations: [{ corporationId: 'moon_energy', corporationName: 'Moon Energy', level: 2 }],
} satisfies Item

describe('calculateCorporationLevelRequirements', () => {
  it('calculates only the corporation levels associated with the item', () => {
    expect(calculateCorporationLevelRequirements(item, 12, corporations)).toEqual([
      {
        corporationId: 'moon_energy',
        corporationName: 'Moon Energy',
        level: 2,
        xpRequired: 600,
        pointsPerItem: 5,
        pointsPerMinute: 60,
        timeMinutes: 10,
        totalItemsNeeded: 120,
      },
    ])
  })

  it('returns no requirements for an item without corporation associations', () => {
    const regularItem = { id: 'glass', name: 'Glass', type: 'component' } satisfies Item

    expect(calculateCorporationLevelRequirements(regularItem, 12, corporations)).toEqual([])
  })
})
