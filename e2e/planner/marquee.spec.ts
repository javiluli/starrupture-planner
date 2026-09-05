import { expect, test } from '@playwright/test'

test('mantiene los 16 objetivos clicables del marquee', async ({ page }) => {
  await page.goto('/')

  const primaryItems = page.getByTestId('planner-marquee-primary').getByRole('link')
  await expect(primaryItems).toHaveCount(16, { timeout: 20_000 })
  await expect(primaryItems.first()).toBeEnabled()
  await expect(primaryItems.last()).toBeEnabled()

  const repeatedItems = page.getByTestId('planner-marquee-copy').getByRole('link')
  await expect(repeatedItems.first()).toHaveAttribute('tabindex', '-1')
})

test('respeta el movimiento reducido en el marquee y la carga del planner', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.getByTestId('planner-marquee-track')).toHaveCSS('animation-name', 'none', { timeout: 20_000 })

  const targetItem = page.getByRole('combobox', { name: 'Select production target' })
  await targetItem.fill('Accumulator')
  await page.getByRole('option', { name: /Accumulator/ }).click()

  await expect(page.getByTestId('planner-result')).toHaveCSS('animation-name', 'none')
  await expect(page.getByTestId('planner-network-graph')).toHaveCSS('animation-name', 'none')
})
