/* @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AssetImage } from './asset-image'

afterEach(cleanup)

describe('Component <AssetImage />', () => {
  it.each([
    ['items', 'accumulator'],
    ['buildings', 'assembler'],
    ['corporations', 'base_core'],
  ] as const)('builds a public URL for %s icons', (kind, id) => {
    render(<AssetImage kind={kind} id={id} width={48} />)

    expect(screen.getByRole('img', { name: id.replaceAll('_', ' ') })).toHaveAttribute('src', `/assets/icons/${kind}/${id}.webp`)
  })

  it('reserves its dimensions and uses native lazy loading by default', () => {
    render(<AssetImage kind="items" id="bar_titanium" width={56} />)

    const image = screen.getByRole('img', { name: 'bar titanium' })
    const container = image.parentElement

    expect(image).toHaveAttribute('width', '56')
    expect(image).toHaveAttribute('height', '56')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(container).toHaveStyle({ width: '56px', height: '56px' })
  })

  it('hides alternative text visually behind a skeleton until the image loads', () => {
    const { container } = render(<AssetImage kind="items" id="accumulator" width={48} />)
    const image = screen.getByRole('img', { name: 'accumulator' })
    const imageContainer = image.parentElement

    expect(imageContainer).toHaveAttribute('data-load-state', 'loading')
    expect(container.querySelector('[data-asset-placeholder]')).toBeInTheDocument()
    expect(image).toHaveStyle({ opacity: '0' })

    fireEvent.load(image)

    expect(imageContainer).toHaveAttribute('data-load-state', 'loaded')
    expect(container.querySelector('[data-asset-placeholder]')).not.toBeInTheDocument()
    expect(image).toHaveStyle({ opacity: '1' })
  })

  it('shows a neutral fallback without exposing broken-image text', () => {
    const { container } = render(<AssetImage kind="items" id="missing" width={48} alt="Missing icon" />)
    const image = screen.getByRole('img', { name: 'Missing icon' })

    fireEvent.error(image)

    expect(image.parentElement).toHaveAttribute('data-load-state', 'error')
    expect(container.querySelector('[data-asset-placeholder]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-asset-fallback]')).toBeInTheDocument()
    expect(image).toHaveStyle({ opacity: '0' })
  })

  it('supports a custom accessible name and eager loading', () => {
    render(<AssetImage kind="items" id="accumulator" width={32} alt="Accumulator" loading="eager" />)

    expect(screen.getByRole('img', { name: 'Accumulator' })).toHaveAttribute('loading', 'eager')
  })
})

