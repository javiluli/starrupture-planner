import { expect, test } from '@playwright/test'

test('mantiene el shell y muestra un 404 semantico para una ruta inexistente', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')

  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to Planner' }).click()
  await expect(page).toHaveURL('/')
})
