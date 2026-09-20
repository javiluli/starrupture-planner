import { expect, test, type Locator } from '@playwright/test'

const expectNameInsideCard = async (card: Locator, name: Locator) => {
  await card.scrollIntoViewIfNeeded()
  const cardBounds = await card.boundingBox()
  const nameBounds = await name.boundingBox()
  expect(cardBounds).not.toBeNull()
  expect(nameBounds).not.toBeNull()
  expect(nameBounds!.x).toBeGreaterThanOrEqual(cardBounds!.x)
  expect(nameBounds!.x + nameBounds!.width).toBeLessThanOrEqual(cardBounds!.x + cardBounds!.width)
  expect(nameBounds!.y + nameBounds!.height).toBeLessThanOrEqual(cardBounds!.y + cardBounds!.height)
}

test('permite buscar y restablecer el catalogo de edificios', async ({ page }) => {
  await page.goto('/my-base')

  const searchInput = page.getByRole('searchbox', { name: 'Search buildings' })
  await expect(searchInput).toBeVisible({ timeout: 20_000 })

  await searchInput.fill('__missing_building__')
  await expect(page.getByText('No buildings found')).toBeVisible()

  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(searchInput).toHaveValue('')
  await expect(page.getByText('No buildings found')).toBeHidden()
  await expect(page.getByLabel(/buildings shown/)).toBeVisible()
})

test('permite colocar y eliminar un edificio usando el teclado', async ({ page }) => {
  await page.goto('/my-base')

  const searchInput = page.getByRole('searchbox', { name: 'Search buildings' })
  await expect(searchInput).toBeVisible({ timeout: 20_000 })
  await searchInput.fill('Furnace')

  const furnace = page.getByRole('button', { name: /^Place Furnace(?! v\.)/ })
  await furnace.focus()
  await furnace.press('Enter')
  await expect(page.getByLabel('Buildings placed: 1')).toBeVisible()

  const selectAll = page.getByRole('button', { name: 'Select all buildings' })
  await selectAll.focus()
  await selectAll.press('Enter')

  const deleteSelection = page.getByRole('button', { name: 'Delete selection' })
  await deleteSelection.focus()
  await deleteSelection.press('Enter')

  await expect(page.getByLabel('Buildings placed: 0')).toBeVisible()
  await expect(deleteSelection).toBeHidden()
})

test('identifica los edificios y sus datos en lista y cuadrícula', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/my-base')

  const searchInput = page.getByRole('searchbox', { name: 'Search buildings' })
  await expect(searchInput).toBeVisible({ timeout: 20_000 })

  const assembler = page.getByRole('button', { name: /Place Assembler/ })
  await expect(assembler).toHaveAccessibleName(/Assembler.*footprint.*Power.*Heat/i)

  await page.getByRole('button', { name: 'Grid view' }).click()
  await expect(assembler.getByText('Assembler', { exact: true })).toBeVisible()
  await expect(assembler).toHaveAccessibleName(/Place Assembler.*footprint/i)
  const longNameCard = page.getByRole('button', { name: /^Place Helium-3 Extractor/ })
  await expectNameInsideCard(longNameCard, longNameCard.getByText('Helium-3 Extractor', { exact: true }))

  const constructorizer = page.getByRole('button', { name: /^Place Constructorizer(?! v\.)/ })
  const constructorName = constructorizer.getByText('Constructorizer', { exact: true })
  await expectNameInsideCard(constructorizer, constructorName)
  await page.setViewportSize({ width: 390, height: 844 })
  await expectNameInsideCard(constructorizer, constructorName)
  await page.setViewportSize({ width: 1440, height: 900 })
  await expectNameInsideCard(constructorizer, constructorName)

  await assembler.focus()
  await assembler.press('Enter')
  await expect(page.getByLabel('Buildings placed: 1')).toBeVisible()
})

test('identifica el Base Core con semántica válida', async ({ page }) => {
  await page.goto('/my-base')
  await expect(page.getByRole('img', { name: 'Base Core' })).toBeVisible({ timeout: 20_000 })
})

test('conserva la colocación por arrastre desde la cuadrícula', async ({ page }) => {
  await page.goto('/my-base')
  await page.getByRole('button', { name: 'Grid view' }).click()

  const card = page.getByRole('button', { name: /^Place Assembler/ })
  const canvas = page.getByTestId('base-designer-canvas')
  const cardBounds = await card.boundingBox()
  const canvasBounds = await canvas.boundingBox()
  expect(cardBounds).not.toBeNull()
  expect(canvasBounds).not.toBeNull()

  await page.mouse.move(cardBounds!.x + cardBounds!.width / 2, cardBounds!.y + cardBounds!.height / 2)
  await page.mouse.down()
  await page.mouse.move(canvasBounds!.x + canvasBounds!.width * 0.65, canvasBounds!.y + canvasBounds!.height * 0.4, { steps: 8 })
  await page.mouse.up()

  await expect(page.getByLabel('Buildings placed: 1')).toBeVisible()
})

test('mantiene contraste legible en la atribución de React Flow', async ({ page }) => {
  await page.goto('/my-base')
  const attribution = page.getByRole('link', { name: 'React Flow' })
  await expect(attribution).toBeVisible({ timeout: 20_000 })

  const colors = await attribution.evaluate((link) => ({
    foreground: getComputedStyle(link).color,
    background: getComputedStyle(link.parentElement!).backgroundColor,
  }))
  const luminance = (color: string) => {
    const channels = color
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number)
    if (!channels || channels.length !== 3) throw new Error(`Unexpected color: ${color}`)
    const linear = channels.map((channel) => {
      const normalized = channel / 255
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
    })
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
  }
  const foreground = luminance(colors.foreground)
  const background = luminance(colors.background)
  const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
  expect(contrast).toBeGreaterThanOrEqual(4.5)
})
