import { expect, test } from '@playwright/test'

test('permite recorrer las secciones principales desde la navegacion', async ({ page }) => {
  await page.goto('/')

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  await expect(navigation).toBeVisible()

  await navigation.getByRole('link', { name: /Items/ }).click()
  await expect(page).toHaveURL(/\/items$/)
  await expect(page.getByRole('table', { name: 'Game items catalog' })).toBeVisible()

  await navigation.getByRole('link', { name: /Buildings/ }).click()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(page.getByRole('heading', { name: 'Buildings & Recipes' })).toBeVisible({ timeout: 20_000 })

  await navigation.getByRole('link', { name: /Corporations/ }).click()
  await expect(page).toHaveURL(/\/corporations$/)
  await expect(page.getByRole('heading', { name: 'Corporations & Rewards' })).toBeVisible()

  await navigation.getByRole('link', { name: /My Base/ }).click()
  await expect(page).toHaveURL(/\/my-base$/)
  await expect(page.getByRole('heading', { name: 'My Base' })).toBeVisible()

  await navigation.getByRole('link', { name: /Planner/ }).click()
  await expect(page).toHaveURL('/')
})

test('conserva deep links, estado activo e historial del navegador', async ({ page }) => {
  await page.goto('/items')

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  const itemsLink = navigation.getByRole('link', { name: 'Items' })
  const buildingsLink = navigation.getByRole('link', { name: 'Buildings' })

  await expect(itemsLink).toHaveAttribute('aria-current', 'page')
  await buildingsLink.click()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(buildingsLink).toHaveAttribute('aria-current', 'page')

  await page.goBack()
  await expect(page).toHaveURL(/\/items$/)
  await expect(itemsLink).toHaveAttribute('aria-current', 'page')

  await page.goForward()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(buildingsLink).toHaveAttribute('aria-current', 'page')
})
