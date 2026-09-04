import { describe, expect, it } from 'vitest'
import { corporations, items } from './index'

describe('item corporation associations', () => {
  it('links every normalized reference to a real corporation level requirement', () => {
    const associatedItems = items.filter((item) => item.corporations.length > 0)

    expect(associatedItems.length).toBeGreaterThan(0)

    for (const item of associatedItems) {
      for (const reference of item.corporations) {
        const corporation = corporations[reference.corporationName]
        const level = corporation?.levels.find((candidate) => candidate.level === reference.level)

        expect(corporation?.id).toBe(reference.corporationId)
        expect(level?.components.some((component) => component.id === item.id)).toBe(true)
      }
    }
  })
})
