import { expect, test } from '@playwright/test'

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

  const furnace = page.getByRole('button', { name: 'Place Furnace', exact: true })
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
