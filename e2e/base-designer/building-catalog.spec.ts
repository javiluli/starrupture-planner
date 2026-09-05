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
