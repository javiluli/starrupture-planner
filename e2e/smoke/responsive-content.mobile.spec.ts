import { expect, test, type Locator } from '@playwright/test'

const expectFullyWithinViewport = async (locator: Locator) => {
  await expect(locator).toBeVisible({ timeout: 20_000 })

  const metrics = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      left: rect.left,
      right: rect.right,
      viewportWidth: document.documentElement.clientWidth,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }
  })

  expect(metrics.left).toBeGreaterThanOrEqual(0)
  expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth + 1)
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
}

test('mantiene legibles Recipes y Corporations a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })

  await page.goto('/recipes')
  await expect(page.getByRole('heading', { name: 'Buildings & Recipes' })).toBeVisible({ timeout: 20_000 })
  await expectFullyWithinViewport(page.getByRole('heading', { name: 'Assembler', exact: true }))
  await expectFullyWithinViewport(page.getByText('Selenian Corporation L.10', { exact: true }).first())

  await page.goto('/corporations')
  await expect(page.getByRole('heading', { name: 'Corporations & Rewards' })).toBeVisible({ timeout: 20_000 })
  await expectFullyWithinViewport(page.getByText(/17[.,]460[.,]700 G/, { exact: true }))
  await expectFullyWithinViewport(page.getByRole('heading', { name: /future health solutions/i, level: 3 }))

  await page.getByRole('button', { name: /future health solutions/i }).click()
  await expectFullyWithinViewport(page.getByText('Level 3', { exact: true }))
})
