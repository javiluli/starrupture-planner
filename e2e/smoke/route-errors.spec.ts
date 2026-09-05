import { expect, test } from '@playwright/test'

test('mantiene el shell y muestra un 404 semantico para una ruta inexistente', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')

  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to Planner' })).toHaveAttribute('href', '/')
})

test('abre y enfoca un nivel de corporation desde un deep link', async ({ page }) => {
  await page.goto('/corporations?corporation=moon_energy_corporation&level=3#corporation-moon_energy_corporation-level-3')

  const targetedLevel = page.getByTestId('corporations-level-moon_energy_corporation-3')
  await expect(targetedLevel).toBeVisible({ timeout: 20_000 })
  await expect(targetedLevel).toBeFocused()
})
