import { expect, test } from '@playwright/test'

// Pending: stabilize interaction with HeroUI Select options without coupling the test to its internal DOM.
test.fixme('filtra un item por cualquiera de sus buildings productores', async ({ page }) => {
  await page.goto('/items')

  const buildingTrigger = page.getByRole('button', { name: /Filter items by building/ })

  await buildingTrigger.click()
  await page.getByRole('listbox').getByRole('option', { name: 'Furnace v.2', exact: true }).click()
  await expect(page.getByRole('row', { name: /Ceramics/ })).toBeVisible()

  await buildingTrigger.click()
  await page.getByRole('listbox').getByRole('option', { name: 'Furnace', exact: true }).click()
  await expect(page.getByRole('row', { name: /Ceramics/ })).toBeVisible()
})

test('abre una materia prima como objetivo terminal desde Items', async ({ page }) => {
  await page.goto('/items')

  await page.getByRole('searchbox', { name: 'Search items' }).fill('Calcium Ore')
  const rawItemRow = page.getByRole('row', { name: /Calcium Ore/ })
  await rawItemRow.getByRole('button', { name: 'Planner' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Calcium Ore' })).toBeVisible()
  await expect(page.getByText('Raw material target')).toBeVisible()
})
