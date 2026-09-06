import { expect, test, type Locator } from '@playwright/test'

const getItemNameFromAction = async (action: Locator) => {
  const label = await action.getAttribute('aria-label')
  if (!label) throw new Error('Expected the marquee action to have an accessible label')
  return label.replace(/^Select /, '').replace(/ as production target$/, '')
}

test('expone solo los 16 objetivos primarios como botones accesibles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const marquee = page.getByTestId('planner-marquee-track')
  const primaryItems = page.getByTestId('planner-marquee-primary').getByRole('button', { name: /^Select .+ as production target$/ })
  await expect(primaryItems).toHaveCount(16, { timeout: 20_000 })
  await expect(primaryItems.first()).toBeEnabled()
  await expect(primaryItems.last()).toBeEnabled()
  await expect(marquee.getByRole('link')).toHaveCount(0)

  const repeatedGroups = page.getByTestId('planner-marquee-copy')
  await expect(repeatedGroups.first()).toHaveAttribute('aria-hidden', 'true')

  const repeatedItems = page.getByTestId('planner-marquee-copy-item')
  await expect(repeatedItems.first()).toHaveAttribute('tabindex', '-1')
  await expect(marquee.getByRole('button')).toHaveCount(16)

  const firstTarget = primaryItems.first()
  const itemName = await getItemNameFromAction(firstTarget)
  await firstTarget.focus()
  await expect(firstTarget).toBeFocused()
  await firstTarget.press('Enter')
  await expect(page.getByRole('combobox', { name: 'Select production target' })).toHaveValue(itemName)
})

test('mantiene las copias visuales clicables sin exponer controles duplicados', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const firstTarget = page.getByTestId('planner-marquee-primary').getByRole('button').first()
  const itemName = await getItemNameFromAction(firstTarget)
  await page.getByTestId('planner-marquee-copy-item').first().click()

  await expect(page.getByRole('combobox', { name: 'Select production target' })).toHaveValue(itemName)
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
