/* @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBuildingNode } from '../../lib/create-building-node'
import { createInitialBaseDesignerNodes } from '../../lib/create-initial-nodes'
import { useBaseDesignerStore } from '@/store/base-designer.store'
import { buildings } from '@/shared/data'
import { BaseDesignerStats } from './base-designer-stats'

beforeEach(() => {
  const solar = buildings.find((building) => building.id === 'solar_generator_v1')
  const fabricator = buildings.find((building) => building.id === 'fabricator')
  if (!solar || !fabricator) throw new Error('Expected base designer fixtures in the game catalog')

  useBaseDesignerStore.setState({
    nodes: [
      ...createInitialBaseDesignerNodes(),
      createBuildingNode({ building: solar, absolutePosition: { x: 100, y: 100 }, instanceId: 'solar' }),
      createBuildingNode({ building: fabricator, absolutePosition: { x: 200, y: 100 }, instanceId: 'fabricator' }),
    ],
    edges: [],
  })
})

afterEach(cleanup)

describe('BaseDesignerStats', () => {
  it('renders totals derived from the controlled nodes', () => {
    render(<BaseDesignerStats />)

    expect(screen.getByLabelText('Buildings placed: 2')).toBeInTheDocument()
    expect(screen.getByText('10 / 10')).toBeInTheDocument()
    expect(screen.getByText('10 / 1000')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Power consumption' })).toHaveAttribute('aria-valuenow', '10')
  })
})
