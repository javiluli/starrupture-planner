import { expect, test } from '@playwright/test'

const MOBILE_WIDTHS = [320, 360, 390, 768]

test('mantiene navegacion y toolbar operables en anchos compactos', async ({ page }) => {
  for (const width of MOBILE_WIDTHS) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')

    const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
    const plannerLink = navigation.getByRole('link', { name: /Planner/ })
    const baseLink = navigation.getByRole('link', { name: /My Base/ })

    await expect(plannerLink).toHaveAttribute('href', '/')
    await expect(baseLink).toHaveAttribute('href', '/my-base')
    await expect(baseLink).toBeVisible()

    const navigationWidth = await navigation.evaluate((element) => ({
      client: element.clientWidth,
      scroll: element.scrollWidth,
    }))
    expect(navigationWidth.scroll).toBeLessThanOrEqual(navigationWidth.client)

    const targetSelect = page.getByRole('combobox', { name: 'Select production target' })
    const targetRate = page.getByRole('textbox', { name: 'Target production per minute' })
    const selectBox = await targetSelect.boundingBox()
    const rateBox = await targetRate.boundingBox()

    expect(selectBox).not.toBeNull()
    expect(rateBox).not.toBeNull()
    if (!selectBox || !rateBox) throw new Error(`Planner toolbar controls are not rendered at ${width}px`)
    expect(selectBox.x).toBeGreaterThanOrEqual(0)
    expect(selectBox.x + selectBox.width).toBeLessThanOrEqual(rateBox.x)
    expect(rateBox.x + rateBox.width).toBeLessThanOrEqual(width)

    const pageWidth = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }))
    expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client)
  }
})

test('mantiene la navegacion principal operable con teclado en movil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  const itemsLink = navigation.getByRole('link', { name: 'Items' })
  await itemsLink.focus()
  await itemsLink.press('Enter')

  await expect(page).toHaveURL('/items')
  await expect(page.getByRole('table', { name: 'Game items catalog' })).toBeVisible()

  const plannerLink = navigation.getByRole('link', { name: 'Planner' })
  await plannerLink.focus()
  await plannerLink.press('Enter')

  await expect(page).toHaveURL('/')
})
