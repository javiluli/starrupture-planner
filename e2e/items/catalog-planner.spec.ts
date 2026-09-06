import { expect, test } from '@playwright/test'

test('filtra un item por cualquiera de sus buildings productores', async ({ page }) => {
  await page.goto('/items')

  const buildingTrigger = page.getByRole('button', { name: /Filter items by building/ })

  await buildingTrigger.click()
  await page.getByTestId('items-building-option-furnacetier2').click()
  await expect(page.getByRole('row', { name: /Ceramics/ })).toBeVisible()

  await buildingTrigger.click()
  await page.getByTestId('items-building-option-furnace').click()
  await expect(page.getByRole('row', { name: /Ceramics/ })).toBeVisible()
})

test('abre una materia prima como objetivo terminal desde Items', async ({ page }) => {
  await page.goto('/items')

  await page.getByRole('searchbox', { name: 'Search items' }).fill('Calcium Ore')
  const rawItemRow = page.getByRole('row', { name: /Calcium Ore/ })
  await rawItemRow.getByRole('button', { name: 'Planner' }).click()

  await expect(page).toHaveURL('/')
  const plannerResult = page.getByTestId('planner-result')
  await expect(plannerResult.getByRole('heading', { name: 'Calcium Ore' })).toBeVisible()
  await expect(plannerResult.getByText('Raw material target')).toBeVisible()
})
