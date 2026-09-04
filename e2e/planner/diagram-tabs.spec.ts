import { expect, test } from '@playwright/test'

test('muestra solo diagramas implementados y conserva el catalogo de buildings', async ({ page }) => {
  await page.goto('/')

  const targetItem = page.getByRole('combobox', { name: 'Select production target' })
  await targetItem.fill('Accumulator')
  await page.getByRole('option', { name: /Accumulator/ }).click()

  const diagramViews = page.getByRole('tablist', { name: 'Production diagram views' })
  await expect(diagramViews.getByRole('tab', { name: 'Network graph' })).toHaveAttribute('aria-selected', 'true')
  await expect(diagramViews.getByRole('tab', { name: 'Buildings' })).toHaveCount(0)

  const primaryNavigation = page.getByRole('tablist', { name: 'Primary navigation' })
  await primaryNavigation.getByRole('tab', { name: /Buildings/ }).click()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(page.getByRole('heading', { name: 'Buildings & Recipes' })).toBeVisible()
})
