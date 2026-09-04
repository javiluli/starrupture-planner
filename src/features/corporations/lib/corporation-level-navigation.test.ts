import { describe, expect, it } from 'vitest'
import { getCorporationLevelAnchorId, getCorporationLevelPath } from './corporation-level-navigation'

describe('corporation level navigation', () => {
  it('builds a shareable route to the exact corporation level', () => {
    expect(getCorporationLevelAnchorId('future_health_solutions', 7)).toBe(
      'corporation-future_health_solutions-level-7',
    )
    expect(getCorporationLevelPath('future_health_solutions', 7)).toBe(
      '/corporations?corporation=future_health_solutions&level=7#corporation-future_health_solutions-level-7',
    )
  })
})
